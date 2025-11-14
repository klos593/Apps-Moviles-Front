import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const DateTimeSelector = ({ onDateChange, initialDate = new Date() }) => {
    const now = new Date();
    const [selectedDate, setSelectedDate] = useState({
        day: initialDate.getDate(),
        month: initialDate.getMonth(),
        year: initialDate.getFullYear(),
        hour: initialDate.getHours(),
        minute: initialDate.getMinutes(),
    });

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const isDateValid = (day, month, year, hour, minute) => {
        const selected = new Date(year, month, day, hour, minute);
        return selected >= now;
    };

    const getValidDays = () => {
        const daysInMonth = getDaysInMonth(selectedDate.month, selectedDate.year);
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
            const lastDay = getDaysInMonth(i, selectedDate.year);
            if (isDateValid(lastDay, i, selectedDate.year, 23, 59)) {
                validMonths.push(i);
            }
        }
        return validMonths;
    };

    const getValidYears = () => {
        const years = [];
        const currentYear = now.getFullYear();
        for (let i = currentYear; i <= currentYear + 10; i++) {
            years.push(i);
        }
        return years;
    };

    const getValidHours = () => {
        const hours = [];
        const isToday = selectedDate.day === now.getDate() &&
            selectedDate.month === now.getMonth() &&
            selectedDate.year === now.getFullYear();

        const startHour = isToday ? now.getHours() : 0;
        for (let i = startHour; i < 24; i++) {
            hours.push(i);
        }
        return hours;
    };

    const getValidMinutes = () => {
        const minutes = [];
        const isNow = selectedDate.day === now.getDate() &&
            selectedDate.month === now.getMonth() &&
            selectedDate.year === now.getFullYear() &&
            selectedDate.hour === now.getHours();

        const startMinute = isNow ? now.getMinutes() : 0;
        for (let i = startMinute; i < 60; i++) {
            minutes.push(i);
        }
        return minutes;
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        if (onDateChange) {
            const date = new Date(
                newDate.year,
                newDate.month,
                newDate.day,
                newDate.hour,
                newDate.minute
            );
            onDateChange(date);
        }
    };

    const renderPicker = (items, selectedValue, onSelect, format = (v) => v) => (
        <ScrollView
            style={styles.picker}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled  
        >
            {items.map((item) => (
                <TouchableOpacity
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
                </TouchableOpacity>
            ))}
        </ScrollView>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seleccionar Fecha y Hora</Text>

            <View style={styles.pickersContainer}>
                {/* Día */}
                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Día</Text>
                    {renderPicker(
                        getValidDays(),
                        selectedDate.day,
                        (day) => handleDateChange({ ...selectedDate, day })
                    )}
                </View>

                {/* Mes */}
                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Mes</Text>
                    {renderPicker(
                        getValidMonths(),
                        selectedDate.month,
                        (month) => {
                            const daysInNewMonth = getDaysInMonth(month, selectedDate.year);
                            const newDay = Math.min(selectedDate.day, daysInNewMonth);
                            handleDateChange({ ...selectedDate, month, day: newDay });
                        },
                        (m) => months[m].substring(0, 3)
                    )}
                </View>

                {/* Año */}
                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Año</Text>
                    {renderPicker(
                        getValidYears(),
                        selectedDate.year,
                        (year) => handleDateChange({ ...selectedDate, year })
                    )}
                </View>

                {/* Hora */}
                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Hora</Text>
                    {renderPicker(
                        getValidHours(),
                        selectedDate.hour,
                        (hour) => handleDateChange({ ...selectedDate, hour }),
                        (h) => h.toString().padStart(2, '0')
                    )}
                </View>

                {/* Minutos */}
                <View style={styles.pickerColumn}>
                    <Text style={styles.label}>Min</Text>
                    {renderPicker(
                        getValidMinutes(),
                        selectedDate.minute,
                        (minute) => handleDateChange({ ...selectedDate, minute }),
                        (m) => m.toString().padStart(2, '0')
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        textAlign: "center",
        color: "#111827",
    },
    pickersContainer: {
        flexDirection: "row",
        height: 160,   // más bajo para que entre cómodo en el modal
    },
    pickerColumn: {
        flex: 1,
        marginHorizontal: 2,
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
        backgroundColor: "#F3F4F6",
        paddingVertical: 4,
    },
    pickerItem: {
        paddingVertical: 6,
        paddingHorizontal: 4,
        alignItems: "center",
        borderRadius: 8,
        marginVertical: 2,
    },
    pickerItemSelected: {
        backgroundColor: "#00cb58b3",
    },
    pickerText: {
        fontSize: 13,
        color: "#374151",
    },
    pickerTextSelected: {
        color: "white",
        fontWeight: "600",
    },
});



export default DateTimeSelector;