// User Service - Gerenciamento de Usuários e Equipe
// Data: 27/02/2026
// Serviço para gerenciar usuários, equipes e permissões

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, TeamMember, Invitation } = require('../models');

class UserService {
  constructor() {
    this.saltRounds = 12;
  }

  // Cria novo usuário
  async createUser(userData) {
    try {
      const {
        email,
        password,
        name,
        companyName,
        phone,
        website,
        plan = 'basic',
        stripeCustomerId = null
      } = userData;

      // Verificar se email já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      // Criar usuário
      const user = new User({
        email,
        password: hashedPassword,
        name,
        companyName,
        phone,
        website,
        plan,
        stripeCustomerId,
        emailVerified: false,
        subscriptionStatus: 'inactive',
        videosThisMonth: 0,
        createdAt: new Date()
      });

      await user.save();

      // Remover senha do retorno
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Usuário criado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Realiza login do usuário
  async loginUser(email, password) {
    try {
      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Senha incorreta');
      }

      // Verificar se conta está ativa
      if (user.status !== 'active') {
        throw new Error('Conta inativa');
      }

      // Atualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Remover senha do retorno
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Login realizado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw new Error(`Erro ao realizar login: ${error.message}`);
    }
  }

  // Busca usuário por ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Remover senha do retorno
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword
      };

    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Atualiza usuário
  async updateUser(userId, updateData) {
    try {
      // Remover campos sensíveis
      const allowedUpdates = [
        'name', 'companyName', 'phone', 'website', 
        'avatar', 'bio', 'preferences'
      ];
      
      const filteredUpdates = {};
      allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredUpdates[field] = updateData[field];
        }
      });

      // Se senha for fornecida, hash
      if (updateData.password) {
        filteredUpdates.password = await bcrypt.hash(updateData.password, this.saltRounds);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        filteredUpdates,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Remover senha do retorno
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return {
        success: true,
        user: userWithoutPassword,
        message: 'Usuário atualizado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Deleta usuário
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Remover membros da equipe
      await TeamMember.deleteMany({ userId });

      // Remover convites
      await Invitation.deleteMany({ userId });

      return {
        success: true,
        message: 'Usuário deletado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  // Busca membros da equipe
  async getTeamMembers(userId) {
    try {
      const teamMembers = await TeamMember.find({ userId })
        .populate('userId', 'name email avatar role')
        .sort({ createdAt: -1 });

      return {
        success: true,
        teamMembers: teamMembers.map(member => ({
          id: member._id,
          user: member.userId,
          role: member.role,
          status: member.status,
          joinedAt: member.createdAt,
          permissions: member.permissions
        }))
      };

    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      throw new Error(`Erro ao buscar membros da equipe: ${error.message}`);
    }
  }

  // Convida membro para equipe
  async inviteTeamMember(userId, email, role = 'member') {
    try {
      const inviter = await User.findById(userId);
      if (!inviter) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se email já está na equipe
      const existingMember = await TeamMember.findOne({ 
        userId,
        'userId.email': email 
      });
      
      if (existingMember) {
        throw new Error('Usuário já está na equipe');
      }

      // Verificar se já existe convite pendente
      const existingInvitation = await Invitation.findOne({
        userId,
        email,
        status: 'pending'
      });

      if (existingInvitation) {
        throw new Error('Já existe convite pendente para este email');
      }

      // Gerar token de convite
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

      // Criar convite
      const invitation = new Invitation({
        userId,
        email,
        role,
        token,
        expiresAt,
        status: 'pending'
      });

      await invitation.save();

      // TODO: Enviar email de convite
      // await this.sendInvitationEmail(invitation);

      return {
        success: true,
        invitation: {
          id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          token: invitation.token,
          expiresAt: invitation.expiresAt
        },
        message: 'Convite enviado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao convidar membro da equipe:', error);
      throw new Error(`Erro ao convidar membro da equipe: ${error.message}`);
    }
  }

  // Aceita convite de equipe
  async acceptInvitation(token, userData) {
    try {
      // Buscar convite válido
      const invitation = await Invitation.findOne({
        token,
        status: 'pending',
        expiresAt: { $gt: new Date() }
      });

      if (!invitation) {
        throw new Error('Convite inválido ou expirado');
      }

      // Verificar se usuário já existe
      let user = await User.findOne({ email: invitation.email });
      
      if (!user) {
        // Criar novo usuário
        user = await this.createUser({
          email: invitation.email,
          password: userData.password || this.generateRandomPassword(),
          name: userData.name,
          plan: 'basic'
        });
      }

      // Adicionar à equipe
      const teamMember = new TeamMember({
        userId: invitation.userId,
        memberId: user._id,
        role: invitation.role,
        status: 'active',
        permissions: this.getRolePermissions(invitation.role)
      });

      await teamMember.save();

      // Atualizar status do convite
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await invitation.save();

      return {
        success: true,
        teamMember: {
          id: teamMember._id,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          },
          role: teamMember.role,
          status: teamMember.status
        },
        message: 'Convite aceito com sucesso'
      };

    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      throw new Error(`Erro ao aceitar convite: ${error.message}`);
    }
  }

  // Remove membro da equipe
  async removeTeamMember(userId, memberId) {
    try {
      const teamMember = await TeamMember.findOneAndDelete({
        userId,
        memberId
      });

      if (!teamMember) {
        throw new Error('Membro da equipe não encontrado');
      }

      return {
        success: true,
        message: 'Membro removido da equipe com sucesso'
      };

    } catch (error) {
      console.error('Erro ao remover membro da equipe:', error);
      throw new Error(`Erro ao remover membro da equipe: ${error.message}`);
    }
  }

  // Atualiza papel do membro da equipe
  async updateTeamMemberRole(userId, memberId, newRole) {
    try {
      const teamMember = await TeamMember.findOneAndUpdate(
        { userId, memberId },
        { 
          role: newRole,
          permissions: this.getRolePermissions(newRole),
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!teamMember) {
        throw new Error('Membro da equipe não encontrado');
      }

      return {
        success: true,
        teamMember: {
          id: teamMember._id,
          role: teamMember.role,
          permissions: teamMember.permissions
        },
        message: 'Papel atualizado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao atualizar papel do membro:', error);
      throw new Error(`Erro ao atualizar papel do membro: ${error.message}`);
    }
  }

  // Busca configurações do usuário
  async getUserSettings(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return {
        success: true,
        settings: {
          notifications: user.preferences?.notifications || {
            email: true,
            push: true,
            sms: false
          },
          privacy: user.preferences?.privacy || {
            profileVisible: true,
            activityVisible: false
          },
          theme: user.preferences?.theme || 'light',
          language: user.preferences?.language || 'pt-BR',
          timezone: user.preferences?.timezone || 'UTC'
        }
      };

    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      throw new Error(`Erro ao buscar configurações: ${error.message}`);
    }
  }

  // Atualiza configurações do usuário
  async updateUserSettings(userId, settings) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Atualizar preferências
      user.preferences = {
        ...user.preferences,
        ...settings
      };

      await user.save();

      return {
        success: true,
        settings: user.preferences,
        message: 'Configurações atualizadas com sucesso'
      };

    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw new Error(`Erro ao atualizar configurações: ${error.message}`);
    }
  }

  // Gera senha aleatória
  generateRandomPassword() {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Retorna permissões por papel
  getRolePermissions(role) {
    const permissions = {
      owner: [
        'manage_team',
        'manage_billing',
        'manage_settings',
        'upload_videos',
        'process_videos',
        'view_analytics',
        'export_data'
      ],
      admin: [
        'manage_team',
        'upload_videos',
        'process_videos',
        'view_analytics',
        'export_data'
      ],
      editor: [
        'upload_videos',
        'process_videos',
        'view_analytics'
      ],
      viewer: [
        'view_analytics'
      ]
    };

    return permissions[role] || permissions.viewer;
  }

  // Verifica permissões do usuário
  async checkPermissions(userId, requiredPermission) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return false;
      }

      // Se dono da conta, tem todas as permissões
      if (user.role === 'owner') {
        return true;
      }

      // Buscar membros da equipe
      const teamMember = await TeamMember.findOne({ userId, memberId: user._id });
      if (!teamMember) {
        return false;
      }

      // Verificar se tem a permissão necessária
      return teamMember.permissions.includes(requiredPermission);

    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      return false;
    }
  }

  // Reseta senha
  async resetPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Gerar token de reset
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      // TODO: Enviar email de reset de senha
      // await this.sendPasswordResetEmail(user);

      return {
        success: true,
        message: 'Email de recuperação de senha enviado'
      };

    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw new Error(`Erro ao resetar senha: ${error.message}`);
    }
  }

  // Atualiza senha com token de reset
  async updatePasswordWithToken(token, newPassword) {
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      });

      if (!user) {
        throw new Error('Token inválido ou expirado');
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

      // Atualizar senha e remover token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return {
        success: true,
        message: 'Senha atualizada com sucesso'
      };

    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw new Error(`Erro ao atualizar senha: ${error.message}`);
    }
  }
}

module.exports = UserService;