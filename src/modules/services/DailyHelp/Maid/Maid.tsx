import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonGrid,
  IonText,
  IonIcon,
  IonButton,
  useIonToast,
  useIonRouter,
} from "@ionic/react";
import "./Maid.css";
import maid from "../../../../assets/Images/maid1.png";
import { call, location, star, arrowBack } from "ionicons/icons";
const Maid: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Function to handle button click
  const handleButtonClick = (time: string) => {
    setSelectedTime(time);
  };

  // Define the time slots
  const timeSlots = ["6am-8am", "9am-11am", "5pm-7pm", "8pm-10pm"];
  const [present] = useIonToast();
  const route = useIonRouter();
  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Maid is successfully added to household",
      duration: 800,
      position: position,
      cssClass: "custom-toast",
    });
  };
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
              onClick={() => route.push(`/maid`)}
            />
            Maid profile
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="profile-card">
          <IonImg alt="maid" src={maid} />
          <IonGrid className="profile-details">
            <IonText className="profile-header">Aruna</IonText>
            <IonText className="profile-text">
              <IonIcon
                icon={call}
                size="small"
                className="icon-style"
                color="black"
              />
              +91 6932587412
            </IonText>
            <IonText className="profile-text">
              <IonIcon
                icon={location}
                size="small"
                className="icon-style"
                color="black"
              />
              chandram palem, madhurawda, visakhapatnam
            </IonText>
            <IonText className="profile-text">
              {[...Array(4)].map((_, index) => (
                <IonIcon
                  key={index}
                  icon={star}
                  size="small"
                  className="rate-style"
                />
              ))}
            </IonText>
          </IonGrid>
        </IonGrid>
        <IonGrid>
          <IonTitle className="timing-heder">Available Timings</IonTitle>
          <IonGrid className="timing-card">
            {timeSlots.map((slot) => (
              <IonButton
                key={slot}
                className="time-slot"
                color={selectedTime === slot ? "primary" : "light"} // Conditional color
                onClick={() => handleButtonClick(slot)}
                style={{
                  backgroundColor: selectedTime === slot ? "#3880ff" : "#fff", // Custom background color
                  color: selectedTime === slot ? "#fff" : "#000", // Custom text color
                }}
              >
                {slot}
              </IonButton>
            ))}
          </IonGrid>
        </IonGrid>
        <IonGrid className="button">
          <IonButton expand="block" onClick={() => presentToast("bottom")}>
            Add service to households
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Maid;
