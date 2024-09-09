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
  IonSelect,
  IonSelectOption,
  useIonToast,
  useIonRouter,
  IonModal,
  IonLabel,
  IonItem,
} from "@ionic/react";
import "../Maid/Maid.css";
import maid from "../../../../assets/Images/maid1.png";
import { call, location, star, arrowBack } from "ionicons/icons";

const MilkManProfile: React.FC = () => {
  // State to track selected time slot and milk quantity
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<string | null>(null);

  // Morning and evening shifts
  const morningShift = [
    "5am-6am",
    "7am-8am",
    "9am-11am",
    "5pm-6pm",
    "7pm-8pm",
    "9pm-10pm",
  ];

  // Milk quantity options
  const milkQuantities = ["0.5 Liters", "1 Liter", "2 Liters"];

  const [present] = useIonToast();
  const route = useIonRouter();

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Milkman service successfully added to household",
      duration: 800,
      position: position,
      cssClass: "custom-toast",
    });
  };
  console.log(selectedShift);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon
              icon={arrowBack}
              size="small"
              className="back-button"
              color="black"
              onClick={() => route.push(`/milkman`)}
            />
            Milk Man Profile
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Profile Section */}
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
              Chandram Palem, Madhurawda, Visakhapatnam
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

        {/* Shift Selection */}
        <IonGrid>
          <IonGrid className="shift-card">
            <IonTitle className="shift-title">Available Timings</IonTitle>
            <IonGrid className="timing-card">
              {morningShift.map((slot) => (
                <IonButton
                  key={slot}
                  className="time-slot"
                  color={selectedShift === slot ? "primary" : "light"}
                  onClick={() => setSelectedShift(slot)}
                  style={{
                    backgroundColor:
                      selectedShift === slot ? "#3880ff" : "#fff",
                    color: selectedShift === slot ? "#fff" : "#000",
                  }}
                >
                  {slot}
                </IonButton>
              ))}
            </IonGrid>
          </IonGrid>
        </IonGrid>

        {/* Milk Quantity Selection */}
        <IonGrid>
          <IonTitle className="quantity-header">Select Milk Quantity</IonTitle>
          <IonGrid className="timing-card">
            {milkQuantities.map((quantity) => (
              <IonButton
                key={quantity}
                className="time-slot"
                color={selectedQuantity === quantity ? "primary" : "light"}
                onClick={() => setSelectedQuantity(quantity)}
                style={{
                  backgroundColor:
                    selectedQuantity === quantity ? "#3880ff" : "#fff",
                  color: selectedQuantity === quantity ? "#fff" : "#000",
                }}
              >
                {quantity}
              </IonButton>
            ))}
          </IonGrid>
        </IonGrid>

        {/* Button to Add Service */}
        <IonGrid className="button">
          <IonButton id="open-modal" expand="block">
            Add service to household
          </IonButton>
        </IonGrid>
        <IonModal
          trigger="open-modal"
          initialBreakpoint={0.4}
          breakpoints={[0, 0.25, 0.5, 0.75, 1]}
          handleBehavior="cycle"
        >
          <IonContent className="ion-padding" scrollY={true}>
            <IonTitle>Service Confirmation</IonTitle>

            {/* Selected Time */}
            <IonItem>
              <IonLabel>Selected Time:</IonLabel>
              <IonText>{selectedShift || "No time selected"}</IonText>
            </IonItem>

            {/* Select Milk Quantity */}
            <IonItem>
              <IonLabel>Select Milk Quantity:</IonLabel>
              <IonSelect
                placeholder="Select Quantity"
                value={selectedQuantity}
                onIonChange={(e) => setSelectedQuantity(e.detail.value)}
              >
                {milkQuantities.map((quantity) => (
                  <IonSelectOption key={quantity} value={quantity}>
                    {quantity}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {/* Service Person Details */}
            <IonItem>
              <IonLabel>Service Person: Aruna</IonLabel>
            </IonItem>

            {/* Confirmation Button */}
            <IonButton
              expand="block"
              style={{ marginTop: "20px" }} // Adjust this for better visibility on small screens
              onClick={() => {
                presentToast("bottom");
                route.push("/household");
              }}
            >
              Confirm Service
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MilkManProfile;
