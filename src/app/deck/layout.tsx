export default function DeckLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="deck-root">
      <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('deck-theme');if(t==='light')document.currentScript.parentElement.setAttribute('data-theme','light')}catch(e){}` }} />
      {children}
    </div>
  )
}
