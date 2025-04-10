import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({
    status: 400,
    description: 'Email required or password must be longer than 4 characters',
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signUp(@Body() signUpData: SignUpDTO) {
    return this.authService.signUp(signUpData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login and get access token' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  @ApiResponse({
    status: 400,
    description: 'Email required or password must be longer than 4 characters',
  })
  @ApiResponse({
    status: 401,
    description: 'Email not found or password incorrect',
  })
  async signIn(@Body() loginData: LoginDTO) {
    return this.authService.signIn(loginData);
  }

  // @Delete('delete/:id')
  // @ApiOperation({ summary: 'Delete a user by ID' })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   description: 'The ID of the user to delete',
  // })
  // @ApiResponse({ status: 200, description: 'User successfully deleted' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // async deleteUser(@Param('id') id: number) {
  //   return this.usersService.deleteUser(id);
  // }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get profile of authenticated user' })
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
