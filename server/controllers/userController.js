import db from "../utils/db.js";



export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth();
        const creations = await db`SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`;
        return res.status(200).json({ success: true, creations });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getPublishedCreations = async (req, res) => {
    try {
        const creations = await db`SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`;
        return res.status(200).json({ success: true, creations });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const toggleLikeCreation = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        // const [creations] = await db`SELECT * FROM creations WHERE id=${id} AND publish=true`;
        const [creations] = await db`SELECT * FROM creations WHERE id=${id}`;

        if (!creations) {
            return res.status(404).json({ success: false, message: "Creation not found" });
        }

        const currentLikes = creations.likes;
        const userIdStr = userId.toString();
        let updatedLikes = [];
        let message;

        if (currentLikes.includes(userIdStr)) {
            //unlike
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = "Creation unliked";
        } else {
            //like
            updatedLikes = [...currentLikes, userIdStr];
            message = "Creation liked";
        }

        const formatterArray=`{${updatedLikes.join(',')}}`;
        
        await db`UPDATE creations SET likes=${formatterArray}::text[] WHERE id=${id}`;


        return res.status(200).json({ success: true, message });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


