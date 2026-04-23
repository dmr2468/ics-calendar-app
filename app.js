

const ICS_URL =
  "https://ics.calendarlabs.com/95/84d417f2/Milwaukee_Brewers_-_MLB.ics";

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

  const now = new Date();

  const futureEvents = events
    .filter(e => e.date > now)   // only future
    .sort((a, b) => a.date - b.date); // earliest first

  const list = document.getElementById("events");

  if (futureEvents.length === 0) {
    list.innerHTML = "<li>No upcoming events</li>";
    return;
  }

  futureEvents.slice(0, 10).forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.title} - ${e.date.toDateString()}`;
    list.appendChild(li);
  });
}


render();
