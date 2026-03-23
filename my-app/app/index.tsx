import { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import * as Calendar from 'expo-calendar';


export default function App() {
  const [events, setEvents] = useState<any[]>([]);
  const [calendarId, setCalendarId] = useState<string | null>(null);

  
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        alert('กรุณาอนุญาตCalendarก่อน');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      console.log('Calendars:', calendars);

      if (calendars.length > 0) {
        setCalendarId(calendars[0].id);
      } else {
        alert('Emulator ไม่มี Calendar → แนะนำใช้มือถือจริง ');
      }
    })();
  }, []);


  const createEvent = async () => {
    if (!calendarId) {
      alert('ยังไม่ได้ calendar ᴖ̈');
      return;
    }

    await Calendar.createEventAsync(calendarId, {
      title: 'My Event :',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 60 * 60 * 1000),
      timeZone: 'Asia/Bangkok',
    });

    alert('สร้างกิจกรรมแล้ว. .');
    loadEvents();
  };

  
  const loadEvents = async () => {
    if (!calendarId) return;

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const result = await Calendar.getEventsAsync(
      [calendarId],
      now,
      nextWeek
    );

    setEvents(result);
  };

  
  const deleteEvent = async (id: string) => {
    await Calendar.deleteEventAsync(id);
    alert('ลบแล้ว. .');
    loadEvents();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Calendar App</Text>

      <Button title="「 ✦ Create Event ✦ 」" onPress={createEvent} />
      <Button title="「 ✦ Load Events  ✦ 」" onPress={loadEvents} />

      <ScrollView>
        {events.map((e) => (
          <View key={e.id} style={{ marginTop: 10 }}>
            <Text>
              {e.title} - {new Date(e.startDate).toLocaleString()}
            </Text>
            <Button
              title="Delete🚮"
              onPress={() => deleteEvent(e.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

