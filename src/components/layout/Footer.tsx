const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:space-y-0 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VeggieDash. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Freshness Delivered to Your Doorstep.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
