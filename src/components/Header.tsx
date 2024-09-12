import { IonCol, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonToolbar, useIonRouter } from "@ionic/react"
import { notificationsOutline, personCircleOutline, reorderFourOutline } from "ionicons/icons";

const Header: React.FC = () => { 
    const router = useIonRouter();
    const handleCardClick = (path: string) => {
      router.push(path);
    };
  
    return (
            <IonHeader>
                <IonToolbar>
                    <IonGrid>
                        <IonRow className="ion-align-items-center">
                            <IonRow className="ion-align-items-center">
                                <IonIcon
                                    icon={reorderFourOutline}
                                    size="large"
                                />
                                <IonCol>
                                    <div>
                                        <strong>Kishore</strong>
                                        <br />
                                        <span>Block-A, 303</span>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonCol className="ion-text-right">
                                <IonIcon
                                    onClick={() => handleCardClick("/notifications")}
                                    icon={notificationsOutline}
                                    size="large"
                                    className="ion-margin-end"
                                />
                                <IonIcon
                                    onClick={() => handleCardClick("/profile")}
                                    icon={personCircleOutline}
                                    size="large"
                                />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>
    )
}
export default Header;