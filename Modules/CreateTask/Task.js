import { DataTypes } from 'sequelise';
import { sequelize } from '../config/db';

const Task = sequelise.define(
    'Task',
    {
        id: {
            type: DataTypes.UUID,
            DefaultValue: UUIDV4,
            PrimaryKey: true,
        },
        title: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {notEmpty: true},
        },
        description: {
            type: DataTypes.TEXT,
           DefaultValue: "",  
        },
        DueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false, 
        },
        priority: {
            type: DataTypes.ENUM('low','medium','high'),
            defaultValue: 'medium',
        },
        status: {
            type: DataTypes.ENUM('pending','in-progress','completed'),
            defaultValue:'pending', 
        },
        tableName: 'tasks',
        timestamps: true,
    }
);


export default Task;