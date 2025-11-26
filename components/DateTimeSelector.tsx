import { DateTime } from "luxon";
import React, { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type SelectorProps = {
    onDateChange?: (isoString: string) => void;
    initialDate?: DateTime;
};

const DateTimeSelector = ({ onDateChange , initialDate = DateTime.local() }: SelectorProps) => {

    const now = DateTime.local();

    const [selectedDate, setSelectedDate] = useState({
        day: initialDate.day,
        month: initialDate.month - 1, 
        year: initialDate.year,
        hour: initialDate.hour,
        minute: initialDate.minute,
    });

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const getDaysInMonth = (month: number, year: number) => {
        return DateTime.local(year, month + 1).daysInMonth;
    };

    const isDateValid = (day: number, month: number, year: number, hour: number, minute: number) => {
        const selected = DateTime.local(year, month + 1, day, hour, minute);
        return selected >= now;
    };

    const getValidDays = () => {
        const daysInMonth = getDaysInMonth(selectedDate.month, selectedDate.year) ?? 0;
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            if (isDateValid(i, selectedDate.month, selectedDate.year, 23, 59)) {
                days.push(i);
            }
        }
        return days;
    };

    const getValidMonths = () => {
        const validMonths = [];
        for (let i = 0; i < 12; i++) {
            const lastDay = getDaysInMonth(i, selectedDate.year) ?? 1;
            if (isDateValid(lastDay, i, selectedDate.year, 23, 59)) {
                validMonths.push(i);
            }
        }
        return validMonths;
    };

    const getValidYears = () => {
        const years = [];
        const currentYear = now.year;
        for (let i = currentYear; i <= currentYear + 1; i++) {
            years.push(i);
        }
        return years;
    };

    const getValidHours = () => {
        const hours = [];
        const isToday =
            selectedDate.day === now.day &&
            selectedDate.month === now.month - 1 &&
            selectedDate.year === now.year;

        const startHour = isToday ? now.hour : 0;

        for (let i = startHour; i < 24; i++) {
            hours.push(i);
        }
        return hours;
    };

    const getValidMinutes = () => {
        const minutes: number[] = [];
        const isNow =
            selectedDate.day === now.day &&
            selectedDate.month === now.month - 1 &&
            selectedDate.year === now.year &&
            selectedDate.hour === now.hour;

        const quarters = [0, 15, 30, 45];
        const currentMinute = now.minute;

        quarters.forEach((q) => {
            if (!isNow || q >= currentMinute) {
                minutes.push(q);
            }
        });

        return minutes;
    };

    const handleDateChange = (newDate: { day: number; month: number; year: number; hour: number; minute: number; }) => {
        setSelectedDate(newDate);
    
        if (onDateChange) {
            const dt = DateTime.local(
                newDate.year,
                newDate.month + 1,
                newDate.day,
                newDate.hour,
                newDate.minute
            );
    
            onDateChange(dt.toUTC().toISO() ?? "");
        }
    };

    const renderPicker = (items: any[], selectedValue: number, onSelect: { (day: any): void; (month: any): void; (year: any): void; (hour: any): void; (minute: any): void; (arg0: any): void; }, format = (v: any) => v) => (
        <ScrollView
            style={styles.picker}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
        >
            {items.map((item: React.Key | null | undefined) => (
                <Pressable
                    key={item}
                    style={[
                        styles.pickerItem,
                        selectedValue === item && styles.pickerItemSelected,
                    ]}
                    onPress={() => onSelect(item)}
                >
                    <Text
                        style={[
                            styles.pickerText,
                            selectedValue === item && styles.pickerTextSelected,
                        ]}
                    >
                        {format(item)}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <View style={styles.pickersContainer}>

                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Día</Text>
                    {renderPicker(
                        getValidDays(),
                        selectedDate.day,
                        (day: any) => handleDateChange({ ...selectedDate, day })
                    )}
                </View>

                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Mes</Text>
                    {renderPicker(
                        getValidMonths(),
                        selectedDate.month,
                        (month: number) => {
                            const daysInNewMonth = getDaysInMonth(month, selectedDate.year) ?? 1;
                            const newDay = Math.min(selectedDate.day, daysInNewMonth);
                            handleDateChange({ ...selectedDate, month, day: newDay });
                        },
                        (m) => months[m].substring(0, 3)
                    )}
                </View>

                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Año</Text>
                    {renderPicker(
                        getValidYears(),
                        selectedDate.year,
                        (year: any) => handleDateChange({ ...selectedDate, year })
                    )}
                </View>

                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Hora</Text>
                    {renderPicker(
                        getValidHours(),
                        selectedDate.hour,
                        (hour: any) => handleDateChange({ ...selectedDate, hour }),
                        (h) => h.toString().padStart(2, "0")
                    )}
                </View>

                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Min</Text>
                    {renderPicker(
                        getValidMinutes(),
                        selectedDate.minute,
                        (minute: any) => handleDateChange({ ...selectedDate, minute }),
                        (m) => m.toString().padStart(2, "0")
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        width: "100%" 
    },
    pickersContainer: { 
        flexDirection: "row", 
        height: 150 
    },
    pickerColumn: { 
        flex: 1, 
        marginHorizontal: 2 
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 4,
        color: "#6B7280",
    },
    picker: { 
        flex: 1, 
        borderRadius: 10, 
        backgroundColor: "#F3F4F6" 
    },
    pickerItem: {
        paddingVertical: 6,
        paddingHorizontal: 4,
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 2,
    },
    pickerItemSelected: { 
        backgroundColor: "#00cb58b3" 
    },
    pickerText: { 
        fontSize: 13, 
        color: "#374151" 
    },
    pickerTextSelected: { 
        color: "white", 
        fontWeight: "600" 
    },
});

export default DateTimeSelector;