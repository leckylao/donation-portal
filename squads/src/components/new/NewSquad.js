import React, { useState } from "react";
import {
  Steps,
  Button,
  message,
  Row,
  Col,
} from "antd";
import Register from "./Register";
import LaunchSquad from "./LaunchSquad";
import SquadForm from "./SquadForm";
import { findSquad, createSquad } from "../../requests";

const { Step } = Steps;

export default function NewSquad() {
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [details, setDetails] = useState({});

  //STEPS CONTROLLERS
  const next = () => {
    const val = current + 1;
    setCurrent(val);
  };

  const prev = () => {
    let val = current - 1;
    setCurrent(val);
  };

  const validateStep = () => {
    if (current === 0) {
      Promise.resolve(localStorage.getItem("fortmatic")).then((fortmatic) => {
        console.log("FORTMATIC: " + fortmatic);
        if (fortmatic.length !== 0) {
          next();
          setError("");
          setWalletConnected(true);
        } else {
          message.error("You need to sign up!");
          setError("error");
          setWalletConnected(false);
        }
      });
    } else if (current === 1) {
    } else if (current === 2) {
      if (walletConnected === true) {
        let dao = "0x0000000000000000ABADBABE0000000000000000";
        let data = {
          name: details.name,
          description: details.description,
          inviteLink: details.inviteLink,
          daoAddress: dao,
        };
        createSquad(data)
          .then((response) => {
            if (response.status === 200) {
              document.location.href = `/squad/${response.data.newSquad._id}`;
            }
          })
          .catch((err) => {
            console.log(err);
            message.error(
              "Oops, something goes wrong, please review all the fields and try it again in a while."
            );
          });
      }
    }
  };

  const setSquadDetails = (values) => {
    console.log(values)
    setDetails(values);
    next();
  }

  const steps = [
    {
      title: "Register",
      content: <Register onCompletedRegister={() => validateStep()}></Register>,
    },
    {
      title: "Enter details",
      content: <SquadForm onFinish={setSquadDetails}></SquadForm>,
    },
    {
      title: "Launch",
      content: <LaunchSquad></LaunchSquad>
    },
  ];

  localStorage.setItem("fortmatic", "");
  return (
    <>
      <Steps
        current={current}
        status={error}
        style={{ marginTop: 32, marginBottom: 32 }}
      >
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        <Row gutter={64} justify="space-around" align="middle">
          {steps[current].content}
        </Row>
      </div>
    </>
  );
}
