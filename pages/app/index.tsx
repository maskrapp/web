import type { NextPage } from "next";
import { AuthWrapper } from "../../components/auth/AuthWrapper";
const Home: NextPage = () => {
  return (
    <AuthWrapper>
      <h1>you are logged in!</h1>
    </AuthWrapper>
  );
};

export default Home;
