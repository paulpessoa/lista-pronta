import { GithubIcon, Linkedin } from 'lucide-react';
import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6">
            <div className="flex justify-center items-center text-center space-x-6 p-2">
                <a
                    href="https://github.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="hover:text-gray-400 transition-colors"
                >
                    <GithubIcon className="w-6 h-6" />
                </a>
                <a
                    href="https://www.linkedin.com/in/paulmspessoa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="hover:text-gray-400 transition-colors"
                >
                    <Linkedin className="w-6 h-6" />
                </a>
            </div>
            <div className="container mx-auto flex-col justify-center items-center text-center">
                <p className="mb-4 md:mb-0">
                    &copy; {currentYear} Lista Pronta. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
