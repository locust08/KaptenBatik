type SummaryItem = {
  label: string;
  value: string;
};

type DetailRow = {
  label: string;
  value: string;
};

type EmailSection = {
  rows?: DetailRow[];
  title: string;
};

type KaptenEmailTemplateOptions = {
  badge?: string;
  intro: string;
  message?: string;
  messageLabel?: string;
  sections: EmailSection[];
  summary: SummaryItem[];
  title: string;
};

function renderSummary(items: SummaryItem[]) {
  if (!items.length) {
    return "";
  }

  return `
    <div class="summary-grid">
      ${items
        .map(
          (item) => `
            <div class="summary-card">
              <div class="summary-label">${item.label}</div>
              <div class="summary-value">${item.value}</div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderRows(rows: DetailRow[]) {
  if (!rows.length) {
    return "";
  }

  return `
    <table class="detail-table" role="presentation" cellpadding="0" cellspacing="0">
      ${rows
        .map(
          (row) => `
            <tr>
              <td class="detail-label">${row.label}</td>
              <td class="detail-value">${row.value}</td>
            </tr>
          `,
        )
        .join("")}
    </table>
  `;
}

function renderSections(sections: EmailSection[]) {
  return sections
    .map(
      (section) => `
        <section class="section-block">
          <div class="section-title">${section.title}</div>
          ${renderRows(section.rows ?? [])}
        </section>
      `,
    )
    .join("");
}

export function renderKaptenBatikAdminEmail({
  badge = "New Website Submission",
  intro,
  message,
  messageLabel = "Message",
  sections,
  summary,
  title,
}: KaptenEmailTemplateOptions) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f3efe6;
            color: #1a1c19;
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
          }

          .email-root {
            width: 100%;
            padding: 28px 16px;
            background:
              radial-gradient(circle at top, rgba(225, 175, 0, 0.14), transparent 34%),
              linear-gradient(180deg, #f7f2e8 0%, #f3efe6 100%);
          }

          .email-card {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            border: 1px solid rgba(117, 91, 0, 0.18);
            border-radius: 28px;
            overflow: hidden;
            background: #fafaf5;
            box-shadow: 0 22px 54px rgba(26, 28, 25, 0.08);
          }

          .hero {
            padding: 30px 32px 28px;
            background:
              linear-gradient(135deg, rgba(225, 175, 0, 0.16), rgba(250, 250, 245, 0) 48%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(250, 250, 245, 1));
            border-bottom: 1px solid rgba(117, 91, 0, 0.12);
          }

          .brand {
            margin: 0 0 18px;
            color: #755b00;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.42em;
            text-transform: uppercase;
          }

          .badge {
            display: inline-block;
            margin-bottom: 14px;
            padding: 7px 12px;
            border: 1px solid rgba(117, 91, 0, 0.16);
            border-radius: 999px;
            background: rgba(255, 248, 239, 0.92);
            color: #755b00;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }

          .title {
            margin: 0;
            color: #1a1c19;
            font-family: "Bodoni MT", Didot, "Times New Roman", Georgia, serif;
            font-size: 36px;
            font-weight: 400;
            line-height: 1.02;
          }

          .intro {
            max-width: 560px;
            margin: 14px 0 0;
            color: #4e4632;
            font-size: 15px;
            line-height: 1.8;
          }

          .content {
            padding: 28px 32px 32px;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 24px;
          }

          .summary-card {
            padding: 16px 18px;
            border: 1px solid rgba(117, 91, 0, 0.1);
            border-radius: 20px;
            background:
              linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 244, 234, 0.96));
          }

          .summary-label {
            margin-bottom: 6px;
            color: #755b00;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          .summary-value {
            color: #1a1c19;
            font-size: 15px;
            font-weight: 700;
            line-height: 1.5;
            word-break: break-word;
          }

          .section-block + .section-block {
            margin-top: 22px;
          }

          .section-title {
            margin: 0 0 12px;
            color: #755b00;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
          }

          .detail-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid rgba(26, 28, 25, 0.08);
            border-radius: 20px;
            overflow: hidden;
            background: #fffdf8;
          }

          .detail-label,
          .detail-value {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(26, 28, 25, 0.08);
            vertical-align: top;
            font-size: 14px;
            line-height: 1.7;
          }

          .detail-table tr:last-child .detail-label,
          .detail-table tr:last-child .detail-value {
            border-bottom: 0;
          }

          .detail-label {
            width: 34%;
            color: #4e4632;
            font-weight: 700;
            background: rgba(248, 244, 234, 0.74);
          }

          .detail-value {
            color: #1a1c19;
            word-break: break-word;
          }

          .message-block {
            margin-top: 22px;
            padding: 18px 20px;
            border: 1px solid rgba(117, 91, 0, 0.12);
            border-radius: 22px;
            background: linear-gradient(180deg, rgba(193, 225, 249, 0.14), rgba(255, 255, 255, 0.98));
          }

          .message-label {
            margin: 0 0 8px;
            color: #755b00;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
          }

          .message-copy {
            margin: 0;
            color: #1a1c19;
            font-size: 15px;
            line-height: 1.8;
            white-space: pre-wrap;
          }

          .footer {
            padding: 0 32px 28px;
            color: rgba(78, 70, 50, 0.86);
            font-size: 12px;
            line-height: 1.7;
          }

          @media only screen and (max-width: 640px) {
            .hero,
            .content,
            .footer {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }

            .title {
              font-size: 28px !important;
            }

            .summary-grid {
              grid-template-columns: 1fr !important;
            }

            .detail-label,
            .detail-value {
              display: block;
              width: 100% !important;
            }

            .detail-label {
              padding-bottom: 6px !important;
              border-bottom: 0 !important;
            }

            .detail-value {
              padding-top: 0 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-root">
          <div class="email-card">
            <div class="hero">
              <div class="brand">Kapten Batik</div>
              <div class="badge">${badge}</div>
              <h1 class="title">${title}</h1>
              <p class="intro">${intro}</p>
            </div>
            <div class="content">
              ${renderSummary(summary)}
              ${renderSections(sections)}
              ${
                message
                  ? `
                    <div class="message-block">
                      <div class="message-label">${messageLabel}</div>
                      <p class="message-copy">${message}</p>
                    </div>
                  `
                  : ""
              }
            </div>
            <div class="footer">
              Sent from the Kapten Batik website lead workflow. Reply directly to this email to continue the conversation with the customer.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
