'use client'

import EmailItem from "./email/EmailItem";
import Header from "./Header";

const HomePage = () => {
  return (
    <div>
      <div className="border-b">
        <div className="mx-auto w-4/5">
          <Header />
        </div>
      </div>
      <EmailItem />
    </div>
  );
};

export default HomePage;
