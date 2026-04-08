const invoices = [
  {
    client: "North Star Studio",
    project: "Brand sprint",
    amount: "$1,800",
    overdue: 4,
    stage: "polite",
  },
  {
    client: "Harbor & Co.",
    project: "Landing page",
    amount: "$4,250",
    overdue: 9,
    stage: "firm",
  },
  {
    client: "Mossfield Labs",
    project: "Retainer",
    amount: "$6,000",
    overdue: 16,
    stage: "escalated",
  },
];

const stages = {
  polite: {
    label: "Polite nudge",
    action: "Friendly reminder with invoice link",
    className: "polite",
  },
  firm: {
    label: "Firm reminder",
    action: "Request payment by end of day",
    className: "firm",
  },
  escalated: {
    label: "Escalation notice",
    action: "Pause work and flag for review",
    className: "escalated",
  },
};

const invoiceList = document.getElementById("invoice-list");
const log = document.getElementById("log");
const summaryPill = document.getElementById("summary-pill");
const template = document.getElementById("invoice-template");

function nextStage(days) {
  if (days >= 14) return "escalated";
  if (days >= 7) return "firm";
  return "polite";
}

function renderInvoices() {
  invoiceList.innerHTML = "";

  invoices.forEach((invoice) => {
    const node = template.content.cloneNode(true);
    const stage = stages[invoice.stage];

    node.querySelector("h3").textContent = invoice.client;
    node.querySelector(".meta").textContent = invoice.project;
    node.querySelector(".status").textContent = stage.label;
    node.querySelector(".amount").textContent = invoice.amount;
    node.querySelector(".overdue").textContent = `${invoice.overdue} days`;
    node.querySelector(".action").textContent = stage.action;
    invoiceList.appendChild(node);
  });

  summaryPill.textContent = `${invoices.length} active`;
}

function renderLog(lines) {
  log.innerHTML = lines
    .map(
      (entry) => `
        <div class="log-entry">
          <div>
            <strong>${entry.title}</strong>
            <time>${entry.time}</time>
          </div>
          <span class="badge ${entry.stage}">${entry.stageLabel}</span>
        </div>
      `,
    )
    .join("");
}

function runEscalation() {
  const now = new Date();

  const logLines = invoices.map((invoice, index) => {
    const stageKey = nextStage(invoice.overdue);
    const stage = stages[stageKey];

    return {
      title: `${invoice.client}: ${stage.action}`,
      time: `Checked ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      stage: stage.className,
      stageLabel: stage.label,
    };
  });

  renderLog(logLines);
}

function seedData() {
  invoices[0].overdue = 4;
  invoices[0].stage = "polite";
  invoices[1].overdue = 9;
  invoices[1].stage = "firm";
  invoices[2].overdue = 16;
  invoices[2].stage = "escalated";
  renderInvoices();
  renderLog([
    {
      title: "Demo reset",
      time: "Ready to run escalation checks",
      stage: "polite",
      stageLabel: "Reset",
    },
  ]);
}

document.getElementById("run-btn").addEventListener("click", runEscalation);
document.getElementById("seed-btn").addEventListener("click", seedData);

seedData();
