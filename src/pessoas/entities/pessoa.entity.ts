import { IsEmail } from 'class-validator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
// import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import { Recado } from 'src/recados/entities/recado.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  nome: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // Uma pessoa pode ter enviado muitos recados (como "de")
  // Esses recadios são relacionados no campo "de" na entidade recado
  @OneToMany(() => Recado, (recado) => recado.de)
  recadosEnviados: Recado[];

  @OneToMany(() => Recado, (recado) => recado.para)
  recadosRecebidos: Recado[];

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'simple-array', default: [] }) //em uma aplicação real pode criar uma tabela para a adm pra so ter a relação de role,
  routePolicies: RoutePolicies[];

  @Column({ default: '' })
  picture: string;
}
