import React from 'react';
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonListHeader,
    IonButton
} from '@ionic/react';
import './SocietyBills.css'; // Import the CSS file

// Define the type for a bill including year, month, date, time, and document URL
interface Bill {
    year: string;
    month: string;
    description: string;
    amount: string;
    postedDate: string;  // Format: YYYY-MM-DD
    postedTime: string;  // Format: HH:MM
    documentUrl: string;
}

// Example data with year, posted date, time, and document URL
const billsData: Bill[] = [
    { year: '2024', month: 'January', description: 'Electricity Bill', amount: '1000', postedDate: '2024-01-05', postedTime: '14:30', documentUrl: 'http://example.com/doc1.pdf' },
    { year: '2024', month: 'January', description: 'Water Bill', amount: '500', postedDate: '2024-01-10', postedTime: '09:00', documentUrl: 'http://example.com/doc2.pdf' },
    { year: '2024', month: 'February', description: 'Maintenance Fee', amount: '2000', postedDate: '2024-02-01', postedTime: '11:15', documentUrl: 'http://example.com/doc3.pdf' },
];

// Get the current year
const currentYear = new Date().getFullYear().toString();

const SocietyBills: React.FC = () => {
    // Sort bills by postedDate and postedTime in descending order
    const sortedBills = billsData.slice().sort((a, b) => {
        const dateA = new Date(`${a.year}-${a.postedDate}T${a.postedTime}`);
        const dateB = new Date(`${b.year}-${b.postedDate}T${b.postedTime}`);
        return dateB.getTime() - dateA.getTime();
    });

    // Group bills by year and month
    const groupedBills: { [year: string]: { [month: string]: Bill[] } } = sortedBills.reduce((acc, bill) => {
        if (!acc[bill.year]) {
            acc[bill.year] = {};
        }
        if (!acc[bill.year][bill.month]) {
            acc[bill.year][bill.month] = [];
        }
        acc[bill.year][bill.month].push(bill);
        return acc;
    }, {} as { [year: string]: { [month: string]: Bill[] } });

    // Handler to view document
    const handleViewDocument = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Society Bills</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {Object.keys(groupedBills).map(year => (
                    <div key={year}>
                        {year !== currentYear && (
                            <IonList>
                                <IonListHeader>
                                    <IonLabel>{year}</IonLabel>
                                </IonListHeader>
                                {Object.keys(groupedBills[year]).map(month => (
                                    <div key={month}>
                                        <IonList>
                                            <IonListHeader>
                                                <IonLabel>{month}</IonLabel>
                                            </IonListHeader>
                                            {groupedBills[year][month].map((bill, index) => (
                                                <IonItem key={index}>
                                                    <IonLabel>
                                                        <h2>{bill.description}</h2>
                                                        <p>Amount: {bill.amount}</p>
                                                        <p>Posted on: {bill.postedDate}, {bill.postedTime}</p>
                                                    </IonLabel>
                                                    <IonButton
                                                        fill="outline"
                                                        onClick={() => handleViewDocument(bill.documentUrl)}
                                                    >
                                                        View
                                                    </IonButton>
                                                </IonItem>
                                            ))}
                                        </IonList>
                                    </div>
                                ))}
                            </IonList>
                        )}
                        {year === currentYear && (
                            <IonList>
                                {Object.keys(groupedBills[year]).map(month => (
                                    <div key={month}>
                                        <IonList>
                                            <IonListHeader>
                                                <IonLabel>{month}</IonLabel>
                                            </IonListHeader>
                                            {groupedBills[year][month].map((bill, index) => (
                                                <IonItem key={index}>
                                                    <IonLabel>
                                                        <h2>{bill.description}</h2>
                                                        <p>Amount: {bill.amount}</p>
                                                        <p>Posted on: {bill.postedDate}, {bill.postedTime}</p>
                                                    </IonLabel>
                                                    <IonButton
                                                        fill="outline"
                                                        onClick={() => handleViewDocument(bill.documentUrl)}
                                                    >
                                                        View
                                                    </IonButton>
                                                </IonItem>
                                            ))}
                                        </IonList>
                                    </div>
                                ))}
                            </IonList>
                        )}
                    </div>
                ))}
            </IonContent>
        </IonPage>
    );
};

export default SocietyBills;
