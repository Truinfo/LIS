import React, { useState } from 'react';
import {
    IonAvatar,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonSearchbar,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import { call } from "ionicons/icons";

const Directory: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const data = [
        {
            block: "Block A",
            contacts: [
                { name: "Swathi", id: "101", phone: "+91 7998723543" },
                { name: "Pradeep", id: "102", phone: "+91 8302405123" }
            ]
        },
        {
            block: "Block B",
            contacts: [
                { name: "Srikanth", id: "103", phone: "+91 6331551256" },
                { name: "Joseph", id: "104", phone: "+91 7245123658" }
            ]
        },
        {
            block: "Block C",
            contacts: [
                { name: "Sheela", id: "105", phone: "+91 8183452376" }
            ]
        }
    ];

    const filterData = () => {
        const query = searchQuery.toLowerCase();
        return data.map(section => ({
            ...section,
            contacts: section.contacts.filter(contact =>
                contact.name.toLowerCase().includes(query) ||
                section.block.toLowerCase().includes(query) ||
                contact.id.toLowerCase().includes(query)
            )
        })).filter(section => section.contacts.length > 0);
    };

    const handleSearchChange = (event: CustomEvent) => {
        setSearchQuery(event.detail.value as string);
    };

    const filteredData = filterData();

    const handleCall = (phoneNumber: string) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Directory</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonSearchbar
                    animated={true}
                    placeholder="Search by name, block, or flat number"
                    value={searchQuery}
                    onIonInput={handleSearchChange}
                />
                <IonList>
                    {filteredData.map((section) => (
                        <React.Fragment key={section.block}>
                            <IonListHeader>
                                <IonLabel>{section.block}</IonLabel>
                            </IonListHeader>
                            {section.contacts.map(({ name, id, phone }) => (
                                <IonItem key={id}>
                                    <IonAvatar slot="start">
                                        <img alt={`Avatar of ${name}`} src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                    </IonAvatar>
                                    <IonLabel>
                                        {name} - {id}
                                        <p style={{ margin: 0, color: 'gray' }}>{phone}</p>
                                    </IonLabel>
                                    <IonButton
                                        fill="clear"
                                        slot="end"
                                        onClick={() => handleCall(phone)}
                                    >
                                        <IonIcon icon={call} />
                                    </IonButton>
                                </IonItem>
                            ))}
                        </React.Fragment>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Directory;
