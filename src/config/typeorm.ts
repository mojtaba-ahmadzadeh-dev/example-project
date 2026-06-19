import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

config({ 
  path: join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`) 
});

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',          
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),

  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  timezone: '+03:30',
});