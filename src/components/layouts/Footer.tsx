export default function Footer() {
  return (
    <footer className="pt-5 pb-20 sm:pt-14 sm:pb-32 border-t bst-border-color">
      <div className="text-center text-sm bst-text-light">
        <p>Copyright &copy; {new Date().getFullYear()} Honeybee Soft</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}