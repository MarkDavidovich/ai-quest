const { default: Player } = require('../../frontend/src/components/Player/Player');
const { PlayerProfile, GameSession, Inventory, sequelize } = require('../db/models');

exports.saveGameState = async (req, res) => {
    const userId = req.user.id;
    const { profile, session, inventory } = req.body;

    const t = await sequelize.transaction();

    try {
        if (profile) {
            await PlayerProfile.upsert({
                user_id: userId,
                ...profile
            }, { transaction: t });
        }
        if (session) {
            await GameSession.upsert({
                user_id: userId,
                ...session,
                last_saved: new Date()
            }, { transaction: t });
        }
        if (inventory && Array.isArray(inventory)) {
            await Inventory.destroy({ where: { user_id: userId }, transaction: t });

            const inventoryData = inventory.map(item => ({
                user_id: userId,
                item_name: item.name,
                quantity: item.quantity
            }));

            await Inventory.bulkCreate(inventoryData, { transaction: t });
        }

        await t.commit();
        res.status(200).json({ message: 'Game saved successfully!' });
    } catch (error) {
        await t.rollback();
        console.error('Save game error:', error);
        res.status(500).json({ error: 'Failed to save game state' });
    }
}