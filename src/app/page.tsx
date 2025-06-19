"use client";
import Main from "@/lib/components/main/Main";
import {
	MainRepositoryModelView,
	MainRepositoryModelViewContext,
} from "@/lib/components/main/repository/repository";
import { useState } from "react";

export default function Page() {
	const [currentRepositoryModelView, setRepositoryModelView] =
		useState<MainRepositoryModelView | null>(null);

	return (
		<MainRepositoryModelViewContext.Provider
			value={{
				currentValue: currentRepositoryModelView,
				setCurrentValue: setRepositoryModelView,
			}}
		>
			<Main />
		</MainRepositoryModelViewContext.Provider>
	);
}
