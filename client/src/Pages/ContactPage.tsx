// Imports
import emailjs from "emailjs-com";
import NavBar from "../Components/NavBar";
import { FormEvent } from "react";
import dotenv from "dotenv";

dotenv.config();

const ContactPage = () => {
  // Once submit is clicked, send email through emailjs.
  const handleEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailjs
      .sendForm(
        `${process.env.REACT_APP_SERVICE_ID}`,
        `${process.env.REACT_APP_TEMPLATE_ID}`,
        e.currentTarget,
        `${process.env.REACT_APP_USER_ID}`
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
    e.currentTarget.reset();
  };

  return (
    <div className="CTContainer">
      <NavBar />
      <div className="CTTxtContainer">
        <div className="CTTitle">Contact us.</div>
        <div className="CTSubtext">
          Have any suggestions, complaints, or feedback? Shoot us an email using
          the form below!
        </div>
      </div>
      <form onSubmit={handleEmail}>
        <div className="CTForm">
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="CTInputBar"
          ></input>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="CTInputBar"
          ></input>
          <input
            type="text"
            placeholder="Subject"
            name="subject"
            className="CTInputBar"
          ></input>
          <textarea
            placeholder="Message"
            name="message"
            className="CTTextArea"
          ></textarea>
          <input type="submit" value="Submit" className="CTSubmit"></input>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
