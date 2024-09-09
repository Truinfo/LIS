import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonGrid,
  IonIcon,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import { arrowBack, call } from "ionicons/icons";
import painter from "../../../assets/Images/painterman.png";
import "./Main.css";
const Painter: React.FC = () => {
  const route = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {" "}
            <IonIcon
              icon={arrowBack}
              size="small"
              className="back-button"
              color="black"
              onClick={() => route.push(`/service`)}
            />
            Painter
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="list-container">
          {[...Array(4)].map((each) => (
            <IonGrid key={each} className="card-container">
              <IonImg alt="plumber" src={painter} className="profile-icon" />
              <IonGrid>
                <IonTitle>Kumar</IonTitle>
                {/* <IonButton className="button"> */}
                <a className="anchor-element" href="tel:+919874563212">
                  <IonButton
                    className="button-technical"
                    color={"light"} // Conditional color
                    style={{
                      backgroundColor: "#fff", // Custom background color
                      color: "#000", // Custom text color
                    }}
                  >
                    <IonIcon icon={call} /> 9874563212
                  </IonButton>
                </a>
              </IonGrid>
            </IonGrid>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Painter;
