import { DataTypes } from 'sequelise';

import { sequelize } from '../config/db';

const Assignment = sequelise.define(

    'Assignment',
    {
        id: {
            type: DataTypes.UUID,

            defaultValue: DataTypes.UUIDV4,

            primayKey: true,
        },
        assignedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        
        tableName: 'assignments',
        timestamps: true,

        indexes: [
            {
                unique: true,
                fields: ['taskId','volunteerId'],
            },
        ],
    },
);


Module.exports = Assingments;