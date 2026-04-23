

const ICS_URL =
  "https://ics.calendarlabs.com/95/84d417f2/Milwaukee_Brewers_-_MLB.ics";


sync function loadEvents() {
  const res = await fetch(ICS_URL);
  const text = await res.text();

  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);

  const events = comp.getAllSubcomponents("vevent");

  const now = new Date();

  return events
    .map(e => {
      const event = new ICAL.Event(e);
      return {
        title: event.summary,
        start: event.startDate.toJSDate(),
        end: event.endDate ? event.endDate.toJSDate() : null
      };
    })
    .filter(e => e.start >= now); // only future events
}

async function renderCalendar() {
  const events = await loadEvents();

  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: events,
    height: 650
  });

  calendar.render();
}

renderCalendar();
