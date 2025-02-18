import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService:UsersService,
        private JwtService: JwtService
        ){}

        async login(UserLoginDto: UserLoginDto) {
            console.log("UserLoginDto:", UserLoginDto);
          
            const User = await this.userService.findOne(UserLoginDto.name);
            console.log("User:", User);
          
            if (!User) {
              console.log("Usuario no encontrado");
              return null;
            }
          
            if (!User.validatePassword(UserLoginDto.password)) {
              console.log("Contraseña incorrecta");
              return null;
            }
          
            const payload = User.getInfoToken();
            console.log("Payload:", payload);
          
            const token = this.JwtService.sign(payload);
            console.log("Token:", token);
          
            return {
              token: token,
              User: User
            };
          }
          
    async register(CreateUserDto: CreateUserDto) {
        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await this.userService.findOne(CreateUserDto.name);
        if (existingUser) {
          return null; // Usuario ya existe, devolver nulo o algún mensaje de error
        }
      
        // Crear un nuevo usuario usando los datos del DTO
        const newUser = await this.userService.create(CreateUserDto);
      
        // Generar el token de autenticación para el nuevo usuario
        const payload = newUser.getInfoToken();
        const token = this.JwtService.sign(payload);
      
        return {
          token: token,
          user: newUser
        };
      }
      
}
