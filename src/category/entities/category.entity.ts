import { Product } from "../../product/entities/product.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
    updateAt: Timestamp;
    
    @ManyToOne(() => User, (user) => user.categories)
    addedBy: User
    
    @OneToMany(() => Product, (prod) => prod.category)
      products: Product[];
}
