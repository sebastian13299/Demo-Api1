import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  
  private users:User[] = [];

  create(createUserDto: CreateUserDto) {
    const {email, name, password} = createUserDto; // Destructuring the properties from the createUserDto object
  if (!email || !name || !password) {
    throw new Error('Missing required fields: email, name, and password are required.');
  }
  
  if (password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
      )
     {
    throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');

  }
  const emailExists = this.users.some(user => user.email === email);
  if (emailExists) {
    throw new Error('Email already exists.');
  }
  const emalRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emalRegex.test(email)) {
  throw new Error('Invalid email format.');
}
  const role = 'Teacher';  // Default role for new users
  const newUser: User = {
    id:Math.random().toString(36).substring(2, 15), // Generate a random id
    name,
    role,
    email,
    password
  };
  this.users.push(newUser);

  return newUser;
}

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const userExists = this.users.find(user => user.id === id.toString());
    if (!userExists) {
      throw new Error('User not found.');
    }
    return userExists;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(user => user.id === id.toString());
  if (userIndex === -1) {
    throw new Error('User not found.');
  }
  const updatedUser = { ...this.users[userIndex], ...updateUserDto };
  this.users[userIndex] = updatedUser;
  return updatedUser;
}

  remove(id: number) {
    const userIndex = this.users.findIndex(user => user.id === id.toString());
  if (userIndex === -1) {
    throw new Error('User not found.');

  }
  const removedUser = this.users.splice(userIndex, 1)[0];
  return removedUser;
  }
}