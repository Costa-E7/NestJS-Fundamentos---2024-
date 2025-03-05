import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn()
    id: number
    @Column({
        length: 63
    })
    name: string
    @Column({
        length: 127
    })
    email: string
    @Column({
        length: 127,
        unique: true
    })
    password: string
    @Column({
        type: 'date',
        nullable: true
    })
    birthAt: string
    @CreateDateColumn()
    createdAt: string
    @UpdateDateColumn()
    updatedAt: string
    @Column({
        type: 'enum',
        enum: ['1', '2'],
        default: '1'
    })
    role: string
}