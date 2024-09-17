import queries from "../queries";

const incorporate = async (
  tgId: Number,
  username: String,
  nickname: String
  // waifuImageId: Number
) => {
  try {
    let user = await queries.user.getOne(tgId);
    if (!user) {
      user = await queries.user.create(tgId, username, nickname, { roleId: 3 });
    }

    if (!user) throw new Error("User not created");
  } catch (error) {}
};

export default { incorporate };
