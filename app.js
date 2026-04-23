const ICS_URL =
  "https://ics.calendarlabs.com/95/84d41f72/Milwaukee_Brewers_-_MLB.ics";

async function loadEvents() {
  const res = await fetch(ICS_URL);
  const text = await res.text();

  console.log("ICS loaded");

  const jcal = ICAL.parse(text);
  const comp = new ICAL.Component(jcal);

  const vevents = comp.getAllSubcomponents("vevent");

  console.log("Event count:", vevents.length);

  const now = new Date();

  return vevents
    .map(v => {
      const ev = new ICAL.Event(v);

      return {
        title: ev.summary || "(no title)",
        start: ev.startDate ? ev.startDate.toJSDate() : null,
        end: ev.endDate ? ev.endDate.toJSDate() : null
      };
    })
      .sort((a, b) => a.start - b.start);
}

function loadNotes() {
  const saved = JSON.parse(localStorage.getItem("familyNotes") || "[]");
  const list = document.getElementById("notesList");

  list.innerHTML = "";

  saved.forEach((note, index) => {
    const li = document.createElement("li");
    li.textContent = note;

    li.onclick = () => deleteNote(index);

    list.appendChild(li);
  });
}

function addNote() {
  const input = document.getElementById("noteInput");
  const value = input.value.trim();

  if (!value) return;

  const notes = JSON.parse(localStorage.getItem("familyNotes") || "[]");

  notes.push(value);
  localStorage.setItem("familyNotes", JSON.stringify(notes));

  input.value = "";
  loadNotes();
}

function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem("familyNotes") || "[]");

  notes.splice(index, 1);
  localStorage.setItem("familyNotes", JSON.stringify(notes));

  loadNotes();
}

document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) {
    console.error("Missing <div id='calendar'> in index.html");
    return;
  }

  const events = await loadEvents();

  
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: "dayGridMonth",

  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay"
  },

  height: 650,
  events
});
``

  calendar.render();
});
