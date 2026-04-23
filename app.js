import * as ICAL from "https://cdn.jsdelivr.net/npm/ical.js@1.4.0/build/ical.min.js";

const ICS_URL =
  "https://raw.githubusercontent.com/jens-maus/node-ical/master/test/fixtures/festival-multiday-rrule.ics";

async function loadEvents() {
  const res = await fetch(ICS_URL);
  const text = await res.text();

  console.log("ICS loaded");

  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);

  const events = comp.getAllSubcomponents("vevent");

  console.log("Event count:", events.length);

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

  if (events.length === 0) {
    list.innerHTML = "<li>No events found</li>";
    return;
  }

  events.slice(0, 10).forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.title} - ${e.date}`;
    list.appendChild(li);
  });
}

render();
