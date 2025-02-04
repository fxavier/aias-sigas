import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className='bg-background text-foreground py-4 text-center'>
			<div className='container mx-auto'>
				<p>
					&copy; {new Date().getFullYear()} Powered by TheCode EI. All rights
					reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
