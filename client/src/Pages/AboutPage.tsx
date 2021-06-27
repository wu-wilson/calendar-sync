// Imports
import NavBar from "../Components/NavBar";

const AboutPage = () => {
  return (
    <div className="ABContainer">
      <NavBar />
      <div className="ABTitleContainer">
        <div className="ABTitle">About us.</div>
        <div className="ABSubtext">
          First time on Calendar Sync? You're in the right place. Learn
          everything you need to get started.
        </div>
      </div>
      <div className="ABTxtContainer">
        <div className="ABTxtBox">
          <div className="ABSubTitle">What is Calendar Sync?</div>
          <div className="ABtext">
            Group projects can get really messy, really fast. It's hard to stay
            organized, especially when the group is large and the project is
            complex.
          </div>
          <div className="ABtext">
            Calendar Sync is a free-to-use tool that lets you create a shared
            calendar. Each day has its own to-do list, making it easy to keep
            track of when and what things need to get done.
          </div>
        </div>
        <div className="ABTxtBox">
          <div className="ABSubTitle">How do I use it?</div>
          <div className="ABtext">
            On the homepage, click the "Get Started" button. It will generate
            you a unique link to share with your group. Once shared, you can
            start planning!
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
