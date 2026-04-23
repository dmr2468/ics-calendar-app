import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

const ICS_URL = "https://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics";

async function loadEvents() {
  const res = await fetch(ICS_URL);
  const text = await res.text();

  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);

  const events = comp.getAllSubcomponents("vevent");
  return events.map(e => {
    const event = new ICAL.Event(e);
    return {
      title: event.summary,
      date: event.startDate.toJSDate()
    };
  });
}

async function render() {
  const events = await loadEvents();
  const list = document.getElementById("events");

  events.slice(0, 10).forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.title} - ${e.date}`;
    list.appendChild(li);
  });
}

render();
