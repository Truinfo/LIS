import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import "./Tab4.css";
import Directory from "../assets/Images/journal.png";
import Notice from "../assets/Images/notice.png";
import Bill from "../assets/Images/bill.png";
import Help from "../assets/Images/GetHelp.png";
import Amenities from "../assets/Images/smart-city.png";

const Tab4: React.FC = () => {
  const router = useIonRouter();
  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <IonPage className="ion-page-background">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="card-container">
          <IonCard
            className="ion-community-cards"
            onClick={() => handleCardClick("/directory")}
          >
            <IonImg alt="Directory" src={Directory} />
            <IonCardHeader>
              <IonCardTitle>Directory</IonCardTitle>
              <IonCardSubtitle>
                Find the Residents Contacts Here...
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="ion-community-cards"
            onClick={() => handleCardClick("/noticeBoard")}
          >
            <IonImg alt="Notice Board" src={Notice} />
            <IonCardHeader>
              <IonCardTitle>Notice Board</IonCardTitle>
              <IonCardSubtitle>
                View All Notices and Society Information
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </div>
        <div className="card-container">
          <IonCard
            className="ion-community-cards"
            onClick={() => handleCardClick("/societyBills")}
          >
            <IonImg alt="Society Bills" src={Bill} />
            <IonCardHeader>
              <IonCardTitle>Society Bills</IonCardTitle>
              <IonCardSubtitle>Find the Society Bills Here...</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="ion-community-cards"
            onClick={() => handleCardClick("/getHelp")}
          >
            <IonImg alt="Notice Board" src={Help} />
            <IonCardHeader>
              <IonCardTitle>Get Help</IonCardTitle>
              <IonCardSubtitle>Do you Need any Help?</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </div>
        <div className="card-container">
          <IonCard
            className="ion-community-cards"
            onClick={() => handleCardClick("/societyBills")}
          >
            <IonImg alt="Society Bills" src={Amenities} />
            <IonCardHeader>
              <IonCardTitle>Amenities</IonCardTitle>
              <IonCardSubtitle>Here is the Facilities Provided</IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
