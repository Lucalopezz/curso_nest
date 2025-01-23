import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Recado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  texto: string;

  // @Column({ type: 'varchar', length: 50 })
  @ManyToOne(() => Pessoa, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }) // Muitos recados podem ser enviados por uma pessoa
  @JoinColumn({ name: 'de' }) // especifica a coluna 'de' que armazena o id da pessoa q enviou o recado
  de: Pessoa;

  @ManyToOne(() => Pessoa, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }) // Muitos recados podem ser enviados para uma pessoa
  @JoinColumn({ name: 'para' })
  para: Pessoa;

  @Column({ default: false })
  lido: boolean;

  @Column()
  data: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
