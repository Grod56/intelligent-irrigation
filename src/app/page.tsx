"use client";
import Main from "@/lib/components/main/Main";
import { MainRepositoryModelView } from "@/lib/components/main/repository/repository";
import { createContext, useState } from "react";

export const MainRepositoryModelViewContext = createContext<{
	currentValue: MainRepositoryModelView | null;
	setCurrentValue: (
		repositoryModelView: MainRepositoryModelView | null
	) => void;
}>({
	currentValue: null,
	setCurrentValue: (_: MainRepositoryModelView | null) => {},
});

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
