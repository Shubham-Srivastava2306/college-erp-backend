import Notice from "../models/Notice.js";

// ✅ Admin uploads a notice
export const createNotice = async (req, res) => {
  try {
    const { title, description, fileUrl } = req.body;
    const notice = await Notice.create({
      title,
      description,
      fileUrl,
      createdBy: req.user._id // admin id from protect middleware
    });
    res.json({ success: true, notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ Faculty fetches all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
