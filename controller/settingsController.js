const updateActiveBusiness = async (req, res) => {
    try {
        const { businessId } = req.body;

        const userId = req.user.userId || req.user.id; // ! we will never know which one can come in future
        
        await UserModel.updateLastActiveBusiness(userId, businessId);
        res.status(200).json({ message: 'Business ID updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { updateActiveBusiness };