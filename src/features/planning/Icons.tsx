import React from 'react';

// Using the logo as a Base64-encoded image to avoid needing a separate asset file.
// FIX: Changed props from React.SVGProps<SVGSVGElement> to React.ImgHTMLAttributes<HTMLImageElement> to match the returned <img> element.
export const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const BullboxLogo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img 
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA2gAAANoAQMAAAD MATvDAAAABlBMVEUAAAAD/AACms9mAAAAAXRSTlMAQObYZgAAAYlJREFUeJzt2LENgEAMBEFbeAXKz2I555JAFnGgmR3Nl+yWc9/ZTuu19A+YyEgcJSNxlo7EWToSZ+koPInjZCSOkpE4S0fFLO0UznaKLJ2iQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQydp2Snaop2gQyd" 
    alt="BULLBOX logo" 
    {...props} 
  />
);

export const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.421-.666-2.47-2.016-2.73-3.562a7.5 7.5 0 0112.961 0c-.26 1.546-1.309 2.896-2.73 3.562zM12 3a9 9 0 100 18 9 9 0 000-18z" />
  </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.578 0c-.275.042-.55.085-.826.13M5.196 5.79A2.25 2.25 0 017.443 3.542h9.114a2.25 2.25 0 012.247 2.248v.001M4.5 5.79V4.5a2.25 2.25 0 012.25-2.25h9.75a2.25 2.25 0 012.25 2.25v1.29" />
  </svg>
);

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const DumbbellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6H8.25a3.75 3.75 0 100 7.5h7.5a3.75 3.75 0 100-7.5zM16.5 6v.008M17.25 12A2.25 2.25 0 0115 14.25h-6A2.25 2.25 0 016.75 12" />
    </svg>
);

export const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75C12 5.447 13.447 4 15 4h.008v.008H15C13.447 4.008 12 5.447 12 6.75zM12 6.75a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h.008a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A2.25 2.25 0 0117.612 3H18.75a2.25 2.25 0 012.25 2.25v.75a2.25 2.25 0 01-2.25 2.25H18.75a2.25 2.25 0 01-2.25-2.25V6.375c0-.621.504-1.125 1.125-1.125h.001c.621 0 1.125.504 1.125 1.125v.375" />
  </svg>
);

export const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 100-2.186m0 2.186a2.25 2.25 0 100-2.186" />
  </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 01-4.874-1.942 1.5 1.5 0 01-.626-1.451V6.31a1.5 1.5 0 012.126-1.31l1.636.942a1.5 1.5 0 001.626 0l1.636-.942a1.5 1.5 0 012.126 1.31v9.038a1.5 1.5 0 01-.626 1.451 9.75 9.75 0 01-4.874 1.942zM12 15.75L12 3" />
  </svg>
);

export const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const documentPath = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";

export const DocumentCsvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d={documentPath} />
        <text x="12" y="18" fontFamily="monospace" fontSize="4" fill="currentColor" textAnchor="middle" fontWeight="bold">CSV</text>
    </svg>
);
export const DocumentPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d={documentPath} />
        <text x="12" y="18" fontFamily="monospace" fontSize="4" fill="currentColor" textAnchor="middle" fontWeight="bold">PDF</text>
    </svg>
);

export const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 3.75v16.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V3.75m-15 0h15M4.5 3.75a2.25 2.25 0 012.25-2.25h10.5a2.25 2.25 0 012.25 2.25" />
  </svg>
);

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008zm0 4.5h.008v.008H12v-.008zm-4.5-4.5h.008v.008H7.5v-.008zm0 4.5h.008v.008H7.5v-.008zm-4.5-4.5h.008v.008H3v-.008zm4.5 0h.008v.008H7.5v-.008zm4.5 0h.008v.008H12v-.008zm4.5 0h.008v.008H16.5v-.008z" />
  </svg>
);

export const ClipboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293V19a2 2 0 01-2 2z" />
  </svg>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-3.833-6.247 4.125 4.125 0 00-3.833 6.247zm0 0l-6.75 6.75M12 12a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a3 3 0 100-6 3 3 0 000 6zm-7.5 7.128a9.38 9.38 0 01-2.625.372 9.337 9.337 0 01-4.121-.952 4.125 4.125 0 013.833-6.247 4.125 4.125 0 013.833 6.247zm0 0l6.75 6.75" />
  </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export const Icons = {
    WhatsApp: WhatsAppIcon,
    Edit: EditIcon,
    Plus: PlusIcon,
    LightBulb: LightBulbIcon,
    Trash: TrashIcon,
    X: XIcon,
    Dumbbell: DumbbellIcon,
    Apple: AppleIcon,
    Share: ShareIcon,
    Download: DownloadIcon,
    Trophy: TrophyIcon,
    BookOpen: BookOpenIcon,
    CheckCircle: CheckCircleIcon,
    XCircle: XCircleIcon,
    Mail: MailIcon,
    DocumentCsv: DocumentCsvIcon,
    DocumentPdf: DocumentPdfIcon,
    Calculator: CalculatorIcon,
    Calendar: CalendarIcon,
    Clipboard: ClipboardIcon,
    ChartBar: ChartBarIcon,
    Settings: SettingsIcon,
    Users: UsersIcon,
    Home: HomeIcon
};
