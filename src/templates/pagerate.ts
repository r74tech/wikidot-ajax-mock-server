// src/templates/pagerate.ts

/**
 * Generate HTML for page rate widget box (numerical rating style)
 */
export function generatePageRateWidgetBox(
	currentRating: number,
	pageId: string | number,
	ratingClassId: string,
): string {
	return `<h1>Page rating</h1>

<p>
\tSimply rate contents of this page.</p>

<div style="text-align: center">
\t<div class="page-rate-widget-box"><span class="rate-points">rating:&nbsp;<span class="number ${ratingClassId}">${currentRating > 0 ? `+${currentRating}` : currentRating}</span></span><span class="rateup btn btn-default"><a title="I like it" href="javascript:;" onclick="WIKIDOT.modules.PageRateWidgetModule.listeners.rate(event, 1)">+</a></span><span class="ratedown btn btn-default"><a title="I don't like it" href="javascript:;" onclick="WIKIDOT.modules.PageRateWidgetModule.listeners.rate(event, -1)">&#8211;</a></span><span class="cancel btn btn-default"><a title="Cancel my vote" href="javascript:;" onclick="WIKIDOT.modules.PageRateWidgetModule.listeners.cancelVote(event)">x</a></span></div>
</div>

\t<p>
\t\t<a href="javascript:;" onclick="WIKIDOT.modules.PageRateModule.listeners.showWho(event, ${pageId})">Look who rated this page</a>
\t</p>
\t
\t<div id="who-rated-page-area"></div>`;
}

/**
 * Generate HTML for plusOnly rating widget (only allows +1 votes)
 */
export function generatePlusOnlyRateWidgetBox(
	currentRating: number,
	pageId: string | number,
	ratingClassId: string,
): string {
	return `<h1>Page rating</h1>

<p>
\tSimply rate contents of this page.</p>

<div style="text-align: center">
\t<div class="page-rate-widget-box"><span class="rate-points">rating:&nbsp;<span class="number ${ratingClassId}">${currentRating > 0 ? `+${currentRating}` : currentRating}</span></span><span class="rateup btn btn-default"><a title="I like it" href="javascript:;" onclick="WIKIDOT.modules.PageRateWidgetModule.listeners.rate(event, 1)">+</a></span><span class="cancel btn btn-default"><a title="Cancel my vote" href="javascript:;" onclick="WIKIDOT.modules.PageRateWidgetModule.listeners.cancelVote(event)">x</a></span></div>
</div>

\t<p>
\t\t<a href="javascript:;" onclick="WIKIDOT.modules.PageRateModule.listeners.showWho(event, ${pageId})">Look who rated this page</a>
\t</p>
\t
\t<div id="who-rated-page-area"></div>`;
}

/**
 * Generate HTML for page rate widget (star rating style)
 */
export function generatePageRateWidget(
	currentRating: number,
	pageId: string | number,
): string {
	return `<h1>Page rating</h1>

<p>
\tSimply rate contents of this page.</p>

<div style="text-align: center">
\t<div class="page-rate-widget"><div class="page-rate-widget-start" data-rating="${currentRating}"></div></div>
</div>

\t<p>
\t\t<a href="javascript:;" onclick="WIKIDOT.modules.PageRateModule.listeners.showWho(event, ${pageId})">Look who rated this page</a>
\t</p>
\t
\t<div id="who-rated-page-area"></div>`;
}

/**
 * Generate HTML for disabled rating widget (when category has rating=null)
 */
export function generateDisabledRateWidget(): string {
	return `<h1>Page rating</h1>

<p>
\tRating is disabled for this page.</p>

<div style="text-align: center">
\t<div class="page-rate-widget-box disabled">
\t\t<span class="rate-points">rating:&nbsp;<span class="number">N/A</span></span>
\t</div>
</div>

\t<div id="who-rated-page-area"></div>`;
}
