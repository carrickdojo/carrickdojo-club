<div class="h-[8vh] bg-purple-800 text-zinc-100">
	<footer>
		<div class="footer-content">
			<div class="footer-links">
				<div>
					<h3>About CarrickDojo</h3>
					<a href="https://coderdojo.com/en/about">What is CoderDojo?</a>
					<a href="/about.html">Our Dojo and Champion</a>
					<a href="/about.html#join">Joining and Tickets</a>
					<a href="/contact.html">Getting in Touch</a>
				</div>
				<div>
					<h3>Projects</h3>
					<a href="https://projects.raspberrypi.org/en/projects">Raspberry Pi Projects</a>
					<a href="https://projects.raspberrypi.org/en/coderdojo">CoderDojo Projects</a>
					<a href="https://online.coolestprojects.org/">Coolest Projects</a>
					<a href="https://scratch.mit.edu/users/CarrickDojo/">Our Scratch Projects</a>
				</div>
				<div>
					<h3>Supporting Us</h3>
					<a href="/mentors.html">Becoming a Mentor</a>
					<a href="/support.html#volunteer">Volunteering and Helping Out</a>
					<a href="/support.html#sponsor">Sponsors and Donations</a>
					<a href="/support.html#hardware">Gifting Laptops and Hardware</a>
				</div>

				<div>
					<h3>Policies and Guidelines</h3>
					<a href="/site.html">Site Information</a>
					<a href="/safeguarding.html">Safeguarding</a>

					<a href="/charter.html">CoderDojo Charter</a>
					<a href="/privacy.html">Privacy Policy</a>
				</div>
			</div>

			<div class="footer-licence">
				<img
					src="images/icons/cc.svg"
					style="
              width: 1.2rem;
              height: 1.2rem;
              position: relative;
              top: 0.2rem;
            "
					alt="Creative Commons"
				/>
				<span>
					This site is open source and a public project. Feel free to examine the code and reuse any
					bits you like. All images have been created by CoderDojo, the Hello World Foundation or
					the Raspberry Pi Foundation.
				</span>
			</div>

			<div class="footer-social">
				<a href="mailto:carrickonshannondojo@gmail.com">
					<img
						src="images/icons/email.svg"
						alt="Email CarrickDojo"
						style="width: 1.5rem; height: 1.5rem"
					/>
				</a>

				<a href="https://github.com/carrickdojo">
					<img
						src="images/icons/github.svg"
						alt="Our Github"
						style="width: 1.5rem; height: 1.5rem"
					/></a
				>
			</div>

			<div class="footer-foundation">
				<div class="foundation-icons">
					<img
						src="images/logos/coderdojo-roundel.svg"
						alt="CoderDojo logo"
						style="width: 4rem; height: 4rem; position: relative; top: 0.2rem"
					/>
					<img
						src="images/logos/raspberry-pi.svg"
						alt="Raspberry Pi logo"
						style="width: 4rem; height: 4rem; position: relative; top: 0.2rem"
					/>
				</div>
				<div class="foundation-text">
					<span>
						CarrickDojo is a branch of CoderDojo. CoderDojo is part of the Raspberry Pi Foundation.</span
					>
				</div>
			</div>

			<div class="footer-about">
				Carrick-on-Shannon CoderClub (CarrickDojo) was founded as a club under the umbrella of the
				Hello World Foundation (CoderDojo). We are overseen by Youth Work Ireland North Connaught
				Youth Services (Registered Charity: 20031817.)
			</div>
		</div>
	</footer>
</div>

<style>
	/* -------------------------------  */
	/* CSS for the parts of our footer  */
	/* -------------------------------  */
	footer {
		background-color: black;
		color: var(--coder-white);
		padding-top: 2.5rem;
		padding-bottom: 2.5rem;
	}

	/* Inside the footer is a CSS grid */
	/* It should be responsive across small, medium and large screens */
	/* It is mobile first, meaning it is written for mobile and media queries deal with larger screens */
	.footer-content {
		max-width: 100%;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 0.2rem 1fr 0.2rem;
		gap: 1rem;
		grid-template-areas:
			'. footer-social .'
			'. footer-links .'
			'. footer-foundation .'
			'. footer-licence .'
			'. footer-about .';
	}

	.footer-links {
		grid-area: footer-links;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		justify-content: space-between;
	}

	.footer-links > div {
		display: flex;
		flex-direction: column;
	}

	.footer-links h3 {
		font-weight: bolder;
		border-bottom: 0.1rem solid var(--color-sky-50);
		font-size: smaller;
		margin: 0.2rem 0;
	}
	.footer-links a {
		color: var(--coder-white);
		font-size: small;
		text-decoration: none;
	}
	.footer-links a:hover {
		color: var(--coder-accent);
	}

	.footer-social {
		grid-area: footer-social;
		display: flex;

		justify-content: center;
		gap: 1rem;
		margin: auto;
	}
	.footer-social a {
		background-color: var(--coder-main);
		padding: 1rem;
		border-radius: 100%;
		border: 0.2rem solid var(--coder-white);
	}
	.footer-social a:hover {
		background-color: var(--coder-main-dark);
		padding: 1rem;
		border-radius: 100%;
		border: 0.2rem solid var(--coder-secondary);
	}

	.footer-foundation {
		grid-area: footer-foundation;
		display: flex;
		gap: 1rem;
		padding: 1rem 0;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		border: 0.1rem solid white;
		border-radius: 0.25rem;
		text-align: center;
		margin: 1rem;
	}

	.footer-licence {
		grid-area: footer-licence;
		font-size: smaller;
	}

	.footer-about {
		grid-area: footer-about;
		font-size: small;
	}

	@media only screen and (min-width: 720px) {
		.footer-content {
			max-width: 70%;
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'footer-links footer-social'
				'footer-links footer-foundation'
				'footer-licence footer-licence'
				'footer-about  footer-about';
		}
	}

	@media only screen and (min-width: 960px) {
		.footer-content {
			max-width: 70%;
			grid-template-columns: 1fr 1fr 1fr;
			grid-template-areas:
				'footer-links footer-links footer-social'
				'footer-links footer-links footer-foundation'
				'footer-licence footer-licence footer-foundation'
				'footer-about footer-about footer-foundation';
		}
		.footer-links {
			flex-direction: row;
		}
	}
</style>
