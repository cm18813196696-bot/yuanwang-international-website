/* Service reports are prepared locally; sending remains in the email application. */
(() => {
  const form = document.querySelector('#service-request-form');
  const status = document.querySelector('#service-request-status');
  const reportOutput = document.querySelector('#service-report-output');
  const preview = document.querySelector('#service-report-preview');
  const labels = [
    ['company', 'Customer / company'], ['country', 'Country'],
    ['project', 'Project / location'], ['model', 'Equipment model'],
    ['serial', 'Equipment serial number'], ['priority', 'Priority'],
    ['commissioned', 'Commissioning date'], ['observed', 'Fault first observed (site local time)'],
    ['timezone', 'Site time zone'], ['contact', 'Contact name'],
    ['email', 'Contact email'], ['phone', 'Contact telephone'],
    ['fault', 'Fault description / frequency'], ['actions', 'Actions already taken'],
    ['parameters', 'Current operating parameters'], ['water', 'Latest water-quality results'],
    ['evidence', 'Photo / video / log references']
  ];

  function prepare() {
    if (!form.reportValidity()) return null;
    const data = new FormData(form);
    const recipient = String(data.get('recipient') || '').trim() || '317196186@qq.com';
    const subject = `YUANWANG Service Request | ${data.get('priority')} | ${data.get('project')}`;
    const body = 'YUANWANG OVERSEAS SERVICE REQUEST\nYW-AFS-2026-01\n\n' +
      labels.map(([key, label]) => `${label}:\n${String(data.get(key) || 'Not provided').trim()}`).join('\n\n') +
      '\n\nSupporting files: attach the photographs, video references and logs listed above before sending.\n' +
      'Please confirm formal registration, request number and assigned engineer.\n';
    reportOutput.value = body;
    preview.hidden = false;
    preview.open = true;
    return { recipient, subject, body, serial: String(data.get('serial') || 'equipment') };
  }

  form?.addEventListener('submit', event => {
    event.preventDefault();
    const report = prepare();
    if (!report) return;
    const link = `mailto:${encodeURIComponent(report.recipient)}?subject=${encodeURIComponent(report.subject)}&body=${encodeURIComponent(report.body)}`;
    if (link.length > 7000) {
      status.textContent = 'Your report is ready below. It is long, so copy or download it and send it with your evidence to ' + report.recipient + '. Nothing has been sent.';
      return;
    }
    status.textContent = 'Report prepared. Your email application may open; review the recipient and add the evidence before sending. Nothing has been sent by this page.';
    window.location.href = link;
  });

  document.querySelector('#download-service-request')?.addEventListener('click', () => {
    const report = prepare();
    if (!report) return;
    const blob = new Blob([report.body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeSerial = report.serial.replace(/[^a-z0-9_-]/gi, '-').slice(0, 60);
    a.download = `YUANWANG-service-request-${safeSerial}.txt`;
    document.body.append(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'The text report is ready to download. Send it through your designated service channel with supporting evidence. Nothing has been sent.';
  });

  document.querySelector('#copy-service-request')?.addEventListener('click', async () => {
    const report = prepare();
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.body);
      status.textContent = 'Report copied. Paste it into your email and add the evidence before sending. Nothing has been sent.';
    } catch {
      reportOutput.focus();
      reportOutput.select();
      status.textContent = 'The report is selected below. Copy it using your browser, then send it through your designated service channel. Nothing has been sent.';
    }
  });

  let closedBeforePrint = [];
  window.addEventListener('beforeprint', () => {
    closedBeforePrint = [...document.querySelectorAll('.service-detail:not([open])')];
    closedBeforePrint.forEach(item => { item.open = true; });
  });
  window.addEventListener('afterprint', () => {
    closedBeforePrint.forEach(item => { item.open = false; });
    closedBeforePrint = [];
  });
  document.querySelectorAll('[data-print-policy], [data-print-record]').forEach(button => {
    button.addEventListener('click', () => window.print());
  });
})();
