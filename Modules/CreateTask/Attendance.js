
import { DataTypes } from 'sequelise';

import { sequelize } from '../config/db';

const Attendance = sequelise.define(

    'Attendance',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        hoursLogged: {
            type: DataTypes.DECIMAL(5,2),
            allowNull: false,
            validate: {min:0},
        },

        status: {
            type: DataTypes.ENUM('present','absent'),
            defaultValue: 'present',
        },

        tableName: 'attendance',
        timestamps: true,
    },

    
);



export default Attendance;