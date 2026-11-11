import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { faq, features, nav, plans, regions } from './content';
import SpecularButton from './SpecularButton';

type OpenLeadForm = (source: string) => void;
type ContactMethod = 'phone' | 'telegram' | 'whatsapp' | 'max' | 'instagram';

function MotionScene({ className, children }: { className: string; children: ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(([entry]) => setIsPlaying(entry.isIntersecting), { threshold: .35 });
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return <div ref={sceneRef} className={`process-scene ${className} ${isPlaying ? 'is-playing' : ''}`} data-ui>{children}</div>;
}

const contactMethods: Record<ContactMethod, { label: string; field: string; placeholder: string; phone: boolean }> = {
  phone: { label: 'Телефон', field: 'Номер телефона', placeholder: '+375 (29) 000-00-00', phone: true },
  telegram: { label: 'Telegram', field: 'Ник в Telegram', placeholder: '@username', phone: false },
  whatsapp: { label: 'WhatsApp', field: 'Телефон в WhatsApp', placeholder: '+375 (29) 000-00-00', phone: true },
  max: { label: 'Max', field: 'Телефон в Max', placeholder: '+7 (999) 000-00-00', phone: true },
  instagram: { label: 'Instagram', field: 'Ник в Instagram', placeholder: '@username', phone: false },
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (!digits) return '';

  if (digits.startsWith('375')) {
    const parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 8), digits.slice(8, 10), digits.slice(10, 12)].filter(Boolean);
    return `+${parts[0]}${parts[1] ? ` (${parts[1]})` : ''}${parts[2] ? ` ${parts[2]}` : ''}${parts[3] ? `-${parts[3]}` : ''}${parts[4] ? `-${parts[4]}` : ''}`;
  }

  if (digits.startsWith('7') || digits.startsWith('8')) {
    const local = digits.slice(1, 11);
    return `+7${local ? ` (${local.slice(0, 3)}` : ''}${local.length >= 3 ? ')' : ''}${local.length > 3 ? ` ${local.slice(3, 6)}` : ''}${local.length > 6 ? `-${local.slice(6, 8)}` : ''}${local.length > 8 ? `-${local.slice(8, 10)}` : ''}`;
  }

  return `+${digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim()}`;
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a className={`logo ${inverse ? 'logo--inverse' : ''}`} href="#top" aria-label="SipVPN, на главную">
      <span className="logo-mark" aria-hidden="true" />
      <span>SipVPN</span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <a className="skip-link" href="#top">К содержанию</a>
      <Logo />
      <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Основная навигация">
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className="nav-mobile-cta" href="#how" onClick={() => setOpen(false)}>Как это работает?</a>
      </nav>
      <a className="button header-cta header-how" href="#how">Как это работает?</a>
      <button
        className={`menu-button ${open ? 'is-open' : ''}`}
        type="button"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}

function RouteGraphic({ regionIndex }: { regionIndex: number }) {
  const region = regions[regionIndex];
  return (
    <div className="route-graphic" aria-label={`Маршрут: ${region.label}, ${region.node}, SIP-провайдер`}>
      <div className="route-line" aria-hidden="true">
        <span className="route-dot route-dot--one" />
        <span className="route-dot route-dot--two" />
      </div>
      <div className="route-stop">
        <span className="route-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
            <path d="M4 14h2a2 2 0 0 1 2 2v4H6a2 2 0 0 1-2-2v-4Z" />
            <path d="M20 14h-2a2 2 0 0 0-2 2v4h2a2 2 0 0 0 2-2v-4Z" />
            <path d="M16 20c-.8 1-2 1.5-3.5 1.5H11" />
          </svg>
        </span>
        <strong>{region.label}</strong>
        <small>Ваш SIP-клиент</small>
      </div>
      <div className="route-stop route-stop--active">
        <span className="route-signal" aria-hidden="true"><i /><i /><i /></span>
        <strong>{region.node}</strong>
        <small>SipVPN relay</small>
      </div>
      <div className="route-stop">
        <span className="route-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="6" rx="2" />
            <rect x="4" y="14" width="16" height="6" rx="2" />
            <path d="M8 7h.01M12 7h4M8 17h.01M12 17h4" />
          </svg>
        </span>
        <strong>Россия</strong>
        <small>SIP-провайдер</small>
      </div>
    </div>
  );
}

function RelayPanel({ onLead }: { onLead: OpenLeadForm }) {
  const [regionIndex, setRegionIndex] = useState(0);
  const [hasRegionChanged, setHasRegionChanged] = useState(false);
  const region = regions[regionIndex];

  const selectRegion = (index: number) => {
    if (index === regionIndex) return;
    setHasRegionChanged(true);
    setRegionIndex(index);
  };

  return (
    <div className={`relay-panel ${hasRegionChanged ? 'has-region-change' : ''}`} data-ui>
      <div className="relay-picker">
        <div className="relay-head">
          <div>
            <span className="ui-label">Конфигуратор подключения</span>
            <h2>Откуда Вы звоните</h2>
          </div>
          <span className="status"><i /><span className="status-full">Серверы SipVPN в сети</span><span className="status-short">В сети</span></span>
        </div>
        <div className="region-selector" role="group" aria-label="Выберите регион">
          {regions.map((item, index) => (
            <button
              key={item.id}
              className={index === regionIndex ? 'is-active' : ''}
              type="button"
              onClick={() => selectRegion(index)}
              aria-pressed={index === regionIndex}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="region-select-mobile">
          <span className="sr-only">Выберите регион</span>
          <select value={regionIndex} onChange={(event) => selectRegion(Number(event.target.value))}>
            {regions.map((item, index) => <option key={item.id} value={index}>{item.label}</option>)}
          </select>
        </label>
        <RouteGraphic key={region.id} regionIndex={regionIndex} />
      </div>
      <div className="relay-summary" aria-live="polite">
        <span className="ui-label">Выбрано:</span>
        <h2 key={`title-${region.id}`}>{region.label} <span aria-hidden="true">→</span> {region.node}</h2>
        <dl className="relay-summary-list" key={`facts-${region.id}`}>
          <div><dt>Задержка:</dt><dd>{region.latency}</dd></div>
          <div><dt>Протокол:</dt><dd>SRTP / DTLS</dd></div>
          <div><dt>Российский IP:</dt><dd>Активен</dd></div>
        </dl>
        <div className="relay-summary-action">
          <SpecularButton type="button" onClick={() => onLead(`Маршрут: ${region.label} → ${region.node}`)}>Подключить SipVPN бесплатно</SpecularButton>
          <span>14 дней бесплатно · карта не нужна</span>
        </div>
      </div>
    </div>
  );
}

function MiniFragment({ kind }: { kind: (typeof features)[number]['kind'] }) {
  if (kind === 'quality') {
    return (
      <div className="fragment quality-fragment" data-ui>
        <div className="quality-top"><span>Качество голоса</span><strong>Стабильно</strong></div>
        <div className="quality-bars" aria-hidden="true">{[62, 74, 66, 81, 78, 90, 84, 96, 88, 92, 94, 91].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        <div className="quality-values"><span>Потери <b>0,2%</b></span><span>Джиттер <b>18 мс</b></span></div>
      </div>
    );
  }

  if (kind === 'apps') {
    return (
      <div className="fragment apps-fragment" data-ui>
        {['Zoiper', 'MicroSIP', 'Grandstream', 'WebRTC'].map((name, index) => (
          <div key={name} className={index === 0 ? 'selected' : ''}><span className="app-badge">{name.slice(0, 1)}</span><b>{name}</b><small>{index === 0 ? 'Подключено' : 'Совместимо'}</small></div>
        ))}
      </div>
    );
  }

  if (kind === 'security') {
    return (
      <div className="fragment security-fragment" data-ui>
        <div className="shield" aria-hidden="true"><span /></div>
        <div><span>Шифрование потока</span><strong>SRTP / DTLS-SRTP</strong></div>
        <div><span>Контур</span><strong>Изолирован</strong></div>
      </div>
    );
  }

  if (kind === 'team') {
    return (
      <div className="fragment team-fragment" data-ui>
        <div className="team-row team-row--head"><span>Аккаунт</span><span>Роль</span><span>Статус</span></div>
        {[
          ['103 · Отдел продаж', 'Менеджер', 'В сети'],
          ['117 · Поддержка', 'Оператор', 'В сети'],
          ['204 · Бухгалтерия', 'Участник', 'Пауза'],
        ].map((row) => <div className="team-row" key={row[0]}>{row.map((cell, index) => <span className={index === 2 ? `team-status ${cell === 'Пауза' ? 'is-paused' : ''}` : undefined} key={cell}>{cell}</span>)}</div>)}
      </div>
    );
  }

  if (kind === 'webrtc') {
    return (
      <div className="fragment webrtc-fragment" data-ui>
        <div className="call-person"><span>АК</span><div><strong>Анна К.</strong><small>Входящий звонок</small></div></div>
        <div className="call-time">00:42</div>
        <div className="call-controls"><button aria-label="Отключить микрофон">Микрофон</button><button className="hang" aria-label="Завершить звонок">Завершить</button></div>
      </div>
    );
  }

  return (
    <div className="fragment compact-route" data-ui>
      <span>За рубежом</span><i /><strong>RU relay</strong><i /><span>SIP</span>
    </div>
  );
}

function Hero({ onLead }: { onLead: OpenLeadForm }) {
  return (
    <>
      <section className="hero" data-enter>
        <div className="hero-copy">
          <h1>
            <span className="hero-title-line"><span>Звонки в Россию</span></span>
            <span className="hero-title-line"><span>из любой страны</span></span>
          </h1>
          <p>SipVPN даёт российский IP-выход для SIP-телефонии и CRM, когда вы работаете за рубежом.</p>
        </div>
        <div className="hero-stage" aria-label="Интерактивный маршрут SipVPN">
          <RelayPanel onLead={onLead} />
        </div>
      </section>

      <section className="statement" aria-label="Как работает маршрут">
        <span>Один маршрут</span>
        <p>SIP-клиент подключается к российскому relay, а тот направляет звонок оператору.</p>
      </section>
    </>
  );
}

function HowItWorks({ onLead }: { onLead: OpenLeadForm }) {
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
  }, []);

  const copyRelayKey = async () => {
    try {
      await navigator.clipboard.writeText('ru-mow-7F3A-82C1');
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="how section" id="how">
      <div className="section-shell">
        <div className="section-heading how-heading">
          <div><span className="how-kicker">Простой старт</span><h2>Подключение за пять минут</h2></div>
          <div className="how-heading-copy"><span className="how-time"><i />≈ 5 минут</span><p>Оставьте заявку, получите персональный relay-ключ и начните звонить.</p></div>
        </div>
        <div className="activation-flow">
          <article className="process-card process-card--request">
            <div className="process-card-top"><span>01</span><b>Заявка</b></div>
            <div className="process-copy"><h3>Оставьте заявку</h3><p>Укажите имя и удобный способ связи. Мы уточним маршрут и поможем со стартом.</p></div>
            <MotionScene className="request-preview">
              <div className="scene-chrome" aria-hidden="true"><i /><i /><i /><span>Новая заявка</span></div>
              <div className="request-scene-content">
                <div className="request-contact"><span>Ваш контакт</span><strong>Telegram · @username</strong></div>
                <div className="request-transit" aria-hidden="true"><span>Заявка</span><i /><b>Принята</b></div>
                <button type="button" onClick={() => onLead('Блок подключения · Шаг 1')}>Оставить заявку <span aria-hidden="true">↗</span></button>
              </div>
              <div className="request-success" aria-hidden="true"><span>✓</span><div><strong>Заявка принята</strong><small>Готовим маршрут SipVPN</small></div></div>
            </MotionScene>
          </article>

          <article className="process-card process-card--key">
            <div className="process-card-top"><span>02</span><b>Relay-ключ</b></div>
            <div className="process-copy"><h3>Получите ключ</h3><p>Пришлём адрес российского узла и персональные параметры подключения.</p></div>
            <MotionScene className="key-preview">
              <div className="scene-chrome" aria-hidden="true"><i /><i /><i /><span>Relay console</span></div>
              <div className="key-scene-content">
                <span>Персональный ключ</span>
                <div className="key-value"><strong>ru-mow-7F3A-82C1</strong><button type="button" className={copied ? 'is-copied' : ''} onClick={copyRelayKey} aria-live="polite">{copied ? 'Готово' : 'Копировать'}</button></div>
                <div className="key-security"><span><i />Ключ активирован</span><b>SRTP / DTLS</b></div>
              </div>
              <div className="key-loader" aria-hidden="true"><i /><span>Генерируем relay-ключ</span><b><i /></b></div>
            </MotionScene>
          </article>

          <article className="process-card process-card--launch">
            <div className="process-card-top"><span>03</span><b>Первый звонок</b></div>
            <div className="process-copy"><h3>Начните звонить</h3><p>Используйте ключ для подключения к серверу SipVPN и начинайте общаться бесплатно.</p></div>
            <MotionScene className="launch-preview">
              <div className="scene-chrome" aria-hidden="true"><i /><i /><i /><span>Softphone</span></div>
              <div className="launch-head"><span>Голосовой канал</span><span className="launch-status" aria-label="Статус: в сети"><i aria-hidden="true" /><b className="is-pending" aria-hidden="true">Соединяем</b><b className="is-online" aria-hidden="true">В сети</b></span></div>
              <div className="call-wave" aria-hidden="true">{[8, 14, 20, 12, 24, 17, 10, 19, 13, 8].map((height, index) => <i key={index} style={{ height }} />)}</div>
              <div className="launch-foot"><div><strong>00:07</strong><span>Первый звонок</span></div><b>168 мс</b></div>
            </MotionScene>
          </article>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="features section" id="features">
      <div className="section-shell">
        <div className="section-heading"><h2>Стабильная SIP-связь</h2><p>Не универсальный VPN, а маршрут, собранный вокруг голосового трафика.</p></div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className={`feature-cell feature-cell--${index + 1}`} key={feature.title}>
              <div className="feature-copy"><h3>{feature.title}</h3><p>{feature.text}</p></div>
              <MiniFragment kind={feature.kind} />
            </article>
          ))}
        </div>
      </div>
      <div className="compatibility" aria-label="Совместимость">
        <span>Работает с</span>
        {['МТС', 'Билайн', 'TTK', 'Квантум', 'Яндекс', 'Zvonok', 'Asterisk'].map((name) => <strong key={name}>{name}</strong>)}
      </div>
    </section>
  );
}

function Security() {
  return (
    <section className="security section" id="security">
      <div className="security-inner section-shell">
        <div className="security-copy">
          <h2>Голос защищён</h2>
          <p>Трафик защищён шифрованием и изолирован в выделенном контуре. Маршрут контролируется от клиента до российского relay.</p>
          <a className="button button--light" href="#faq">Вопросы о безопасности</a>
        </div>
        <div className="security-console" data-ui>
          <div className="console-head"><span>Защита соединения</span><span className="status status--light"><i /> Активна</span></div>
          {[
            ['Голосовой поток', 'SRTP'],
            ['Сигнализация', 'TLS'],
            ['WebRTC', 'DTLS-SRTP'],
            ['Контур relay', 'Изолирован'],
          ].map(([label, value]) => <div className="console-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          <div className="console-route"><span>Клиент</span><i /><span>RU relay</span><i /><span>Оператор</span></div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ onLead }: { onLead: OpenLeadForm }) {
  const [selected, setSelected] = useState(1);
  const plan = plans[selected];

  return (
    <section className="pricing section" id="pricing">
      <div className="section-shell pricing-layout">
        <div className="section-heading pricing-heading">
          <h2>Тарифы SipVPN</h2>
          <p>Выберите объём работы сейчас. Тариф можно изменить или отменить позже.</p>
        </div>
        <div className="plan-deck" role="tablist" aria-label="Тарифы SipVPN">
          {plans.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls="selected-plan"
              className={`plan-option plan-option--${index + 1} ${selected === index ? 'is-active' : ''}`}
              onClick={() => setSelected(index)}
            >
              <span className="plan-option-top"><span>0{index + 1}</span><i /></span>
              <strong>{item.name}</strong>
              <span className="plan-option-price">{item.price}<small>{item.period}</small></span>
              <span className="plan-option-copy">{item.summary}</span>
            </button>
          ))}
        </div>
        <div className="plan-stage" id="selected-plan" role="tabpanel" aria-live="polite">
          <div className="plan-stage-name"><span>Вы выбрали</span><strong>{plan.name}</strong></div>
          <div className="plan-price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
          <p>{plan.summary}</p>
          <button className="button" type="button" onClick={() => onLead(`Тариф: ${plan.name}`)}>{plan.button}</button>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="faq section" id="faq">
      <div className="section-shell faq-layout">
        <h2>Частые вопросы</h2>
        <div className="faq-list">
          {faq.map((item, index) => (
            <details key={item.q} name="faq" open={index === 0}>
              <summary><span>{item.q}</span><i aria-hidden="true" /></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing({ onLead }: { onLead: OpenLeadForm }) {
  return (
    <section className="closing section" id="contact">
      <div className="section-shell closing-inner">
        <div className="closing-copy">
          <h2>Попробуйте SipVPN</h2>
          <p>14 дней бесплатно. Карта не нужна. Настройка занимает около пяти минут.</p>
          <div className="closing-actions">
            <button className="button button--dark" type="button" onClick={() => onLead('Финальный экран')}>Попробовать бесплатно</button>
            <a className="text-link" href="#how">Как это работает</a>
          </div>
        </div>
        <div className="closing-route" data-ui role="img" aria-label="Маршрут SipVPN от SIP-клиента через российский relay к оператору">
          <div className="closing-route-head"><span>Подключение SipVPN</span><span className="status"><i /> Готово</span></div>
          <div className="closing-route-path" aria-hidden="true">
            <span><i />SIP-клиент</span><b /><span className="is-active"><i />RU relay</span><b /><span><i />Оператор</span>
          </div>
          <div className="closing-route-foot"><span>SRTP / DTLS</span><strong>Настройка за 5 минут</strong></div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onLead }: { onLead: OpenLeadForm }) {
  return (
    <footer className="footer">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand"><Logo inverse /><p>Российский SIP relay для связи из любой страны.</p></div>
          <button className="footer-action" type="button" onClick={() => onLead('Подвал сайта')}><span>Попробовать бесплатно</span><b aria-hidden="true">↗</b></button>
        </div>
        <div className="footer-directory">
          <span>© 2026 SipVPN</span>
          <div className="footer-nav">{nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
          <a href="#top">Наверх ↑</a>
        </div>
        <div className="footer-wordmark" aria-hidden="true">SipVPN</div>
      </div>
    </footer>
  );
}

function LeadForm({ open, source, onClose }: { open: boolean; source: string; onClose: () => void }) {
  const [name, setName] = useState('');
  const [method, setMethod] = useState<ContactMethod>('phone');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const methodMeta = contactMethods[method];

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => nameInput.current?.focus(), 80);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onClose]);

  const changeMethod = (nextMethod: ContactMethod) => {
    setMethod(nextMethod);
    setContact('');
    setError('');
    setStatus('idle');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanContact = contact.trim();
    if (cleanName.length < 2) {
      setError('Укажите имя, чтобы мы знали, как к вам обратиться.');
      return;
    }

    if (methodMeta.phone && cleanContact.replace(/\D/g, '').length < 7) {
      setError('Проверьте номер телефона — в нём не хватает цифр.');
      return;
    }

    if (!methodMeta.phone && cleanContact.replace(/^@/, '').length < 2) {
      setError(`Укажите корректный ник в ${methodMeta.label}.`);
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@somedesigner.me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Имя: cleanName,
          'Способ связи': methodMeta.label,
          Контакт: cleanContact,
          Источник: source,
          _subject: `Новая заявка SipVPN — ${cleanName}`,
          _template: 'table',
          _honey: '',
        }),
      });

      if (!response.ok) throw new Error('FormSubmit request failed');
      setStatus('success');
      setName('');
      setContact('');
    } catch {
      setStatus('error');
      setError('Не получилось отправить заявку. Попробуйте ещё раз через минуту.');
    }
  };

  if (!open) return null;

  return (
    <div className="lead-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="lead-dialog" role="dialog" aria-modal="true" aria-labelledby="lead-title">
        <button className="lead-close" type="button" onClick={onClose} aria-label="Закрыть форму"><span /><span /></button>
        {status === 'success' ? (
          <div className="lead-success" aria-live="polite">
            <span aria-hidden="true">✓</span>
            <h2 id="lead-title">Заявка отправлена</h2>
            <p>Свяжемся с вами выбранным способом и поможем настроить SipVPN.</p>
            <button className="button button--dark" type="button" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <>
            <div className="lead-heading">
              <span>Быстрая заявка</span>
              <h2 id="lead-title">Начните с бесплатных 14 дней</h2>
              <p>Оставьте удобный контакт. Мы поможем выбрать маршрут и подключиться.</p>
            </div>
            <form className="lead-form" onSubmit={submit}>
              <label>
                <span>Ваше имя</span>
                <input ref={nameInput} name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" autoComplete="name" required />
              </label>
              <label>
                <span>Как с вами связаться</span>
                <select name="contact_method" value={method} onChange={(event) => changeMethod(event.target.value as ContactMethod)}>
                  {Object.entries(contactMethods).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
                </select>
              </label>
              <label className="lead-contact">
                <span>{methodMeta.field}</span>
                <input
                  name="contact"
                  type={methodMeta.phone ? 'tel' : 'text'}
                  inputMode={methodMeta.phone ? 'tel' : 'text'}
                  autoComplete={methodMeta.phone ? 'tel' : 'off'}
                  value={contact}
                  onChange={(event) => setContact(methodMeta.phone ? formatPhone(event.target.value) : event.target.value)}
                  placeholder={methodMeta.placeholder}
                  required
                />
              </label>
              {error && <p className="lead-error" role="alert">{error}</p>}
              <button className="button button--dark lead-submit" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
              </button>
              <p className="lead-note">Используем контакт только для связи по вашей заявке.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [leadSource, setLeadSource] = useState('');
  const openLeadForm = useCallback((source: string) => setLeadSource(source), []);
  const closeLeadForm = useCallback(() => setLeadSource(''), []);

  return (
    <>
      <Header />
      <main id="top">
        <Hero onLead={openLeadForm} />
        <HowItWorks onLead={openLeadForm} />
        <Features />
        <Security />
        <Pricing onLead={openLeadForm} />
        <Faq />
        <Closing onLead={openLeadForm} />
      </main>
      <Footer onLead={openLeadForm} />
      <LeadForm open={Boolean(leadSource)} source={leadSource} onClose={closeLeadForm} />
    </>
  );
}
