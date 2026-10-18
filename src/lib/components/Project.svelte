<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';

	export interface ProjectType {
		id: string;
		title: string;
		introduction: string;
		content: string;
		img: string;
	}

	let project: ProjectType = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{project.title}</Card.Title>
		<Card.Description>{project.introduction ?? 'No Intro'}</Card.Description>
		<Card.Action>Card Action</Card.Action>
	</Card.Header>
	<Card.Content>
		{@html project.content}
		<enhanced:img src={project.img ?? ''} alt="An alt text" />
	</Card.Content>
	<Card.Footer>
		<p>{project.id}</p>
	</Card.Footer>
</Card.Root>

<!-- 'id' => $id, 'title' => get_the_title($id), 'img' => get_the_post_thumbnail_url($id), 'introduction'
=> get_field('page__introduction', $id), 'content' => get_the_content(null, null, $id) -->
