import { IonBackButton, IonButtons, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonPage, IonPopover, IonText, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import bill from "../../assets/Images/bill.png";
import { useState } from "react";
import { ellipsisVertical } from "ionicons/icons";
import "./Notifications.css";

const Notifications: React.FC = () => {
    const [showPopover, setShowPopover] = useState<{ isOpen: boolean, event: Event | undefined, notificationId: number | null }>({ isOpen: false, event: undefined, notificationId: null });
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Maintenance Fee Reminder",
            message: "Reminder: Your maintenance fee of [Amount] is due on [Due Date].",
            time: "1d",
            image: bill
        },
        {
            id: 2,
            title: "Scheduled Maintenance",
            message: "Notice: Water supply will be interrupted on [Date] from [Time] to [Time] for maintenance.",
            time: "2d",
            image: bill
        },
        {
            id: 3,
            title: "Security Alert",
            message: "Security Alert: Unusual activity reported. Stay vigilant and report anything suspicious.",
            time: "3d",
            image: bill
        },
        {
            id: 4,
            title: "Community Event",
            message: "Join us for the Community Gathering on [Date] at [Venue]. See you there!",
            time: "4d",
            image: bill
        },
    ]);

    const [presentAlert] = useIonAlert();

    // Function to handle notification deletion
    const handleDeleteNotification = (id: number) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
        setShowPopover({ isOpen: false, event: undefined, notificationId: null });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Notifications</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {notifications.map((notification) => (
                    <IonGrid className="notification-list" key={notification.id}>
                        <div className="menu-icon">
                            <IonIcon icon={ellipsisVertical} className=""
                                onClick={(e) => setShowPopover({ isOpen: true, event: e.nativeEvent, notificationId: notification.id })}
                            />
                            <IonText><p>{notification.time}</p></IonText>
                        </div>
                        <IonImg src={notification.image} className="notification-image" />
                        <div className="notification-content">
                            <IonText><h2>{notification.title}</h2></IonText>
                            <IonText><p>{notification.message}</p></IonText>
                        </div>
                    </IonGrid>
                ))}

                <IonPopover
                    isOpen={showPopover.isOpen}
                    event={showPopover.event}
                    onDidDismiss={() => setShowPopover({ isOpen: false, event: undefined, notificationId: null })}

                >
                    <IonContent className="custom-popover">
                        <IonText onClick={() => {
                            presentAlert({
                                header: 'Confirm Deletion',
                                message: 'Are you sure you want to delete this notification?',
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                        handler: () => {
                                            setShowPopover({ isOpen: false, event: undefined, notificationId: null });
                                        }
                                    },
                                    {
                                        text: 'Delete',
                                        handler: () => handleDeleteNotification(showPopover.notificationId!)
                                    }
                                ]
                            });
                        }} color="danger">Delete Notification</IonText>
                    </IonContent>
                </IonPopover>
            </IonContent>
        </IonPage>
    );
}

export default Notifications;
